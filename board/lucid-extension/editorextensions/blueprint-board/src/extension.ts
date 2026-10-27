import {
    BlockProxy,
    EditorClient,
    Menu,
    MenuLocation,
    Panel,
    PanelLocation,
    Viewport,
} from 'lucid-extension-sdk';
import panelHtml from '../resources/panel.html';

const client = new EditorClient();
const menu = new Menu(client);
const viewport = new Viewport(client);

/**
 * The slice of BoardState (shared/contract.ts) this extension reads. Kept local because this
 * package builds on its own, outside the pnpm workspace.
 * AUDIT: if shared/contract.ts renames MapNode/MapEdge fields, this drifts silently. Update both.
 */
type MapNode = {id: string; symbol: string; column: string; status: string};
type MapEdge = {from: string; to: string};
type BoardState = {nodes: MapNode[]; edges: MapEdge[]};

/** Shape data key we stamp on every block we create: the node's MapNode.id. */
const BP_ID = 'bp_id';
/** The display name, kept separately so a status line can be appended without losing it. */
const BP_LABEL = 'bp_label';

const BLOCK_W = 180;
const BLOCK_H = 70;
/** Distance between the left edges of two columns, and between the tops of two rows. */
const X_STEP = 260;
const Y_STEP = 110;

/** 24x24 panel icon, inlined as base64 so the panel needs no external asset. */
const ICON_URL = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cmVjdCB4PSIyIiB5PSI0IiB3aWR0aD0iOCIgaGVpZ2h0PSI2IiByeD0iMSIgZmlsbD0iIzJiN2RlOSIvPjxyZWN0IHg9IjE0IiB5PSIxNCIgd2lkdGg9IjgiIGhlaWdodD0iNiIgcng9IjEiIGZpbGw9IiMxMTdhMzYiLz48cGF0aCBkPSJNMTAgN2g0YTIgMiAwIDAgMSAyIDJ2NSIgc3Ryb2tlPSIjNWM2YjdhIiBzdHJva2Utd2lkdGg9IjEuNSIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==';

/** Fill colors per status (every NodeStatus in shared/contract.ts). */
const STATUS_FILL: {[status: string]: string} = {
    'existing': '#ffffff',
    'in_progress': '#cce5ff',
    'changing': '#ffe0b3',
    'conflict': '#ffcccc',
    'resolved': '#e6d9ff',
    'built': '#ccffcc',
    'drift': '#fff3b0',
};

/** The last BoardState the panel forwarded. "Draw map" uses it; null until the panel connects. */
let latestState: BoardState | null = null;

function findByBpId(bpId: string): BlockProxy | undefined {
    const page = viewport.getCurrentPage();
    if (!page) {
        console.warn('[blueprint] no current page');
        return undefined;
    }
    return page.allBlocks.find((b) => b.shapeData.getString(BP_ID) === bpId);
}

/**
 * Paint a block according to its status, and show the status on a second line
 * under its name. ProcessBlock has a single text area, so the status is a line
 * within it rather than an independently styled text area.
 */
function applyStatus(block: BlockProxy, status: string): void {
    const fill = STATUS_FILL[status];
    if (fill) {
        block.setFillStyle(fill);
    } else {
        console.warn('[blueprint] unknown status, leaving fill alone:', status);
    }
    const name = block.shapeData.getString(BP_LABEL) || block.shapeData.getString(BP_ID);
    block.textAreas.set('Text', `${name}\n${status}`);
}

/** Folder columns in the order they first appear, so the layout is stable between runs. */
function columnsOf(nodes: MapNode[]): string[] {
    const columns: string[] = [];
    for (const node of nodes) {
        if (!columns.includes(node.column)) {
            columns.push(node.column);
        }
    }
    return columns;
}

/** Grid slot of every node: column = its folder, row = its order within that folder. */
function slotsOf(nodes: MapNode[]): Map<string, {col: number; row: number}> {
    const slots = new Map<string, {col: number; row: number}>();
    columnsOf(nodes).forEach((column, col) => {
        nodes.filter((n) => n.column === column).forEach((node, row) => slots.set(node.id, {col, row}));
    });
    return slots;
}

/**
 * Make the page match the state: add a block for every node that doesn't have one yet, a line
 * for every edge touching a new block, and recolor everything. Blocks already on the page stay
 * where they are (people may have dragged them), and new ones go in their column's grid slot.
 */
function syncMap(state: BoardState): void {
    const slots = slotsOf(state.nodes);
    const existing = new Map<string, BlockProxy>();
    for (const node of state.nodes) {
        const block = findByBpId(node.id);
        if (block) existing.set(node.id, block);
    }

    // The grid's origin: worked back from a block that's already drawn, or, on the first draw,
    // free space near where the user is looking (page coordinates are unrelated to the viewport).
    let page, x: number, y: number;
    const anchorId = [...existing.keys()][0];
    if (anchorId) {
        const anchor = existing.get(anchorId)!;
        const box = anchor.getBoundingBox();
        const slot = slots.get(anchorId)!;
        page = anchor.getPage();
        x = box.x - slot.col * X_STEP;
        y = box.y - slot.row * Y_STEP;
    } else {
        const cols = columnsOf(state.nodes).length;
        const rows = Math.max(...[...slots.values()].map((s) => s.row)) + 1;
        ({page, x, y} = viewport.findAvailableSpace((cols - 1) * X_STEP + BLOCK_W, (rows - 1) * Y_STEP + BLOCK_H));
    }
    // AUDIT: if an anchor block was dragged, new blocks land relative to its new spot, which can
    // overlap other blocks. Fine for the demo; a real layout pass would fix it.

    const blocks = new Map(existing);
    const added: BlockProxy[] = [];
    for (const node of state.nodes) {
        let block = blocks.get(node.id);
        if (!block) {
            const slot = slots.get(node.id)!;
            block = page.addBlock({
                className: 'ProcessBlock',
                boundingBox: {x: x + slot.col * X_STEP, y: y + slot.row * Y_STEP, w: BLOCK_W, h: BLOCK_H},
            });
            block.shapeData.set(BP_ID, node.id);
            block.shapeData.set(BP_LABEL, node.symbol);
            blocks.set(node.id, block);
            added.push(block);
        }
        applyStatus(block, node.status);
    }

    // Only edges touching a new block, so repeated syncs don't stack duplicate lines.
    // AUDIT: a new edge between two blocks that were both already drawn is never added.
    // Endpoints are attached to the blocks themselves, so the lines follow them when they move.
    for (const edge of state.edges) {
        const from = blocks.get(edge.from);
        const to = blocks.get(edge.to);
        if (!from || !to || !(added.includes(from) || added.includes(to))) continue;
        page.addLine({
            endpoint1: {connection: from, linkX: 1, linkY: 0.5},
            endpoint2: {connection: to, linkX: 0, linkY: 0.5},
        });
    }

    if (added.length > 0) {
        viewport.focusCameraOnItems([...blocks.values()]);
    }
    console.log(`[blueprint] synced ${blocks.size} blocks (${added.length} new)`);
}

/** ProcessBlock has to be loaded once before addBlock can use it. */
let blockClassesLoaded: Promise<unknown> | null = null;

async function syncMapWhenReady(state: BoardState): Promise<void> {
    blockClassesLoaded = blockClassesLoaded ?? client.loadBlockClasses(['ProcessBlock']);
    await blockClassesLoaded;
    syncMap(state);
}

/**
 * Right-dock panel whose iframe holds the websocket to the Blueprint server. The iframe
 * does the networking (and the decision buttons) and forwards each BoardState up to us.
 */
class BlueprintPanel extends Panel {
    constructor(client: EditorClient) {
        super(client, {
            title: 'Blueprint',
            location: PanelLocation.RightDock,
            content: panelHtml,
            persist: true,
            iconUrl: ICON_URL,
            width: 320,
        });
    }

    protected messageFromFrame(message: any): void {
        try {
            if (!message || message.type !== 'state' || !Array.isArray(message.state?.nodes)) {
                console.warn('[blueprint] ignoring malformed panel message:', message);
                return;
            }
            latestState = message.state;
            // Async: errors are caught here, since Lucid swallows them silently.
            syncMapWhenReady(message.state).catch((e) => console.error('[blueprint] sync failed:', e));
        } catch (e) {
            console.error('[blueprint] handling panel message failed:', e);
        }
    }
}

const panel = new BlueprintPanel(client);

// Errors thrown inside an action are swallowed by Lucid, so every action logs its own.
client.registerAction('blueprint-open-live-panel', () => {
    try {
        panel.show();
    } catch (e) {
        console.error('[blueprint] open panel failed:', e);
    }
});

client.registerAction('blueprint-draw-map', async () => {
    try {
        if (!latestState) {
            console.warn('[blueprint] no state yet: open the live panel first');
            return;
        }
        await syncMapWhenReady(latestState);
    } catch (e) {
        console.error('[blueprint] draw map failed:', e);
    }
});

menu.addDropdownMenuItem({
    label: 'Blueprint: open live panel',
    action: 'blueprint-open-live-panel',
    location: MenuLocation.Extension,
});

menu.addDropdownMenuItem({
    label: 'Blueprint: draw map',
    action: 'blueprint-draw-map',
    location: MenuLocation.Extension,
});
