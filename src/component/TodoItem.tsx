import { useAtom } from "jotai";
import {
  ChangeEventHandler,
  KeyboardEventHandler,
  useCallback,
  useRef,
  useState,
} from "react";
import { useDebouncedCallback } from "use-debounce";
import { allTodosAtom } from "../store/todos";
import { Todo } from "../types/todo";
import { invoke } from "@tauri-apps/api";
// import { useDoubleClick } from "../hooks/useDoubleClick";
// import { useClickAway } from "react-use";

const TodoItem: React.FC<{ todo: Todo }> = ({ todo }) => {
  const [editing, setEditing] = useState(false);
  const [, setTodos] = useAtom(allTodosAtom);
  const ref = useRef<HTMLInputElement>(null);

  const toggleDone = useDebouncedCallback(() => {
    invoke("toggle_done", { id: todo.id });
  }, 500);

  const setLabel = useDebouncedCallback((label: string) => {
    invoke("update_todo", {
      todo: { ...todo, label },
    });
  }, 500);

  const deleteTodo = useCallback(() => {
    invoke("update_todo", {
      todo: { ...todo, is_delete: true },
    });
  }, [todo]);

  const onDelete = () => {
    setTodos((todos) => {
      return todos.filter((t) => {
        return t.id !== todo.id;
      });
    });
    deleteTodo();
  };

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const label = e?.target.value;
    setTodos((todos) => {
      return todos.map((t) => {
        if (t.id === todo.id) {
          setLabel(label);
          return { ...t, label };
        }
        return t;
      });
    });
  };

  // useClickAway(ref, () => {
  //   finishEditing();
  // });

  // const finishEditing = useCallback(() => {
  //   setEditing(false);
  // }, []);

  // const handleViewClick = useDoubleClick(null, () => {
  //   setEditing(true);
  // });

  //Check in select

  const onDone = useCallback(() => {
    setTodos((todos) => {
      return todos.map((t) => {
        if (t.id === todo.id) {
          toggleDone();
          return { ...t, done: !t.done };
        }
        return t;
      });
    });
  }, [setTodos, todo.id, toggleDone]);

  const onEnter = useCallback<KeyboardEventHandler<HTMLInputElement>>(
    (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        // finishEditing();
      }
    },
    []
  );
  return (
    <li
      className={[editing && "editing", todo.done && "completed"].join(" ")}
      //   .filter(Boolean)
      //   .join(" ")}
      // onClick={handleViewClick}
    >
      <div className="view">
        <input
          type="checkbox"
          className="toggle"
          checked={todo.done}
          onChange={onDone}
        />
        <label>{todo.label}</label>
        <button className="destroy" onClick={onDelete}></button>
      </div>
      {/* {editing && ( */}
      <input
        ref={ref}
        type="text"
        autoFocus={true}
        value={todo.label}
        onChange={onChange}
        className="edit"
        onKeyPress={onEnter}
      />
      {/* )} */}
    </li>
  );
};
export default TodoItem;
