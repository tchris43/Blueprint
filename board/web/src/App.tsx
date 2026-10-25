// The starting shell: it loads the sample data and lists it, so you can see the data
// before you draw anything. Each task replaces a piece of this. Start with tasks/board/1-*.md.

import { useState } from "react";
import { scenes } from "./sampleData";

export function App() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const scene = scenes[sceneIndex];

  return (
    <div className="app">
      <header className="toolbar">
        <strong className="brand">Blueprint</strong>
        {/* TODO task 3: replace this <select> with <SceneSwitcher> and add the View and Layer <Toggle>s */}
        <select value={sceneIndex} onChange={(e) => setSceneIndex(Number(e.target.value))} aria-label="Scene">
          {scenes.map((s, i) => (
            <option key={s.id} value={i}>
              {i + 1}. {s.title}
            </option>
          ))}
        </select>
      </header>
      <p className="scene-bar">{scene.narration}</p>

      <main className="shell">
        {/* TODO task 1: replace this list with <ReactFlow nodes={toFlowNodes(…)} edges={toFlowEdges(…)} /> */}
        <h2>Nodes ({scene.state.nodes.length})</h2>
        <ul>
          {scene.state.nodes.map((node) => (
            <li key={node.id}>
              <code>{node.symbol}</code> · {node.status}
              {node.owner ? ` · ${node.owner}` : ""}
            </li>
          ))}
        </ul>
        {/* TODO task 4: a <ConflictCard> for each scene.state.conflicts */}
        <h2>Conflicts ({scene.state.conflicts.length})</h2>
        {/* TODO task 6: history panel when a node is clicked */}
      </main>
    </div>
  );
}
