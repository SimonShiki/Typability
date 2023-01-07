import MilkdownEditor from "./components/MilkdownEditor";
import styles from './App.module.scss';
import TitleBar from "./components/TitleBar";

function App() {
  return (
    <div className={styles.container}>
      <TitleBar />
      <div className={styles.editor}>
        <MilkdownEditor
          useMenu={true}
          content={"# 🗒️ Typability\nA quick brown fox jumps over the lazy dog"}
        />
      </div>
    </div>
  );
}

export default App;
