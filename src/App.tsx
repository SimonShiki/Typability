import MilkdownEditor from "./components/MilkdownEditor";
import styles from './App.module.scss';
import TitleBar from "./components/TitleBar";
import { useAtom } from "jotai";
import { contentJotai, filePathJotai } from "./jotais/file";
import { loadingJotai } from "./jotais/ui";
import classNames from "classnames";
import { Spinner } from "@fluentui/react-components";
import { useLayoutEffect } from "react";
import { readTextFile } from '@tauri-apps/api/fs';

function App() {
  const [content, setContent] = useAtom(contentJotai);
  const [filePath] = useAtom(filePathJotai);
  const [loading] = useAtom(loadingJotai);
  useLayoutEffect(() => {
    if (filePath !== null) {
      readTextFile(filePath).then((text) => {
        setContent(text);
      }).catch((e) => {
        console.error(e);
      });
    }
  }, [filePath]);
  return (
    <div className={styles.container}>
      <TitleBar />
      <div className={styles.editor}>
        <MilkdownEditor
          useMenu={false}
          content={content}
        />
      </div>
      <div
        data-tauri-drag-region
        className={classNames(styles.mask, {
          [styles.white]: loading
        })}
      >
        <Spinner />
      </div>
    </div>
  );
}

export default App;
