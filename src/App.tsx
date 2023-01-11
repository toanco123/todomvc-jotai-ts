import "./App.css";
import TodoList from "./component/TodoList";
import { useAtom } from "jotai";
import { filterAtom } from "./store/todos";
// import { invoke } from "@tauri-apps/api";
// import { useEffect } from "react";
// import { Todo } from "./types/todo";

function App() {
  const [todos] = useAtom(filterAtom);
  // const [, setAllTodos] = useAtom(allTodosAtom);
  // useEffect(() => {
  //   invoke<Todo[]>("get_todos").then((res) => {
  //     setAllTodos(res);
  //   });
  // }, [setAllTodos]);

  return (
    <div className="todoapp">
      <TodoList todos={todos} />
    </div>
  );
}

export default App;
