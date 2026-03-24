import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const columnsFromBackend = {
    todo: {
        name: "Do zrobienia",
        items: []
    },
    inprogress: {
        name: "W trakcie",
        items: []
    },
    done: {
        name: "Zrobione",
        items: []
    }
};

function KanbanBoard() {
    const [columns, setColumns] = useState(columnsFromBackend);

    // Nowe stany do formularza
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('todo');
    const [priority, setPriority] = useState('normal');
    const [dueDate, setDueDate] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = () => {
        fetch('/api/tasks')
            .then(res => res.json())
            .then(tasks => {
                const grouped = {
                    todo: [],
                    inprogress: [],
                    done: []
                };
                tasks.forEach(task => {
                    if (grouped[task.status]) {
                        grouped[task.status].push(task);
                    }
                });
                setColumns({
                    todo: { name: "Do zrobienia", items: grouped.todo },
                    inprogress: { name: "W trakcie", items: grouped.inprogress },
                    done: { name: "Zrobione", items: grouped.done }
                });
            });
    };

    const onDragEnd = (result, columns, setColumns) => {
        if (!result.destination) return;
        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            removed.status = destination.droppableId;

            // Aktualizacja statusu na backendzie
            fetch(`/api/tasks/${removed.id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ status: removed.status })
            }).then(() => {
                // Aktualizacja frontendowa
                destItems.splice(destination.index, 0, removed);
                setColumns({
                    ...columns,
                    [source.droppableId]: {
                        ...sourceColumn,
                        items: sourceItems
                    },
                    [destination.droppableId]: {
                        ...destColumn,
                        items: destItems
                    }
                });
            }).catch(() => {
                setMessage('Błąd przy aktualizacji statusu');
            });

        } else {
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems
                }
            });
        }
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setMessage('Tytuł jest wymagany');
            return;
        }
        const newTask = {
            title,
            description,
            status,
            priority,
            dueDate: dueDate || null
        };
        fetch('/api/tasks', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newTask)
        })
            .then(res => {
                if (res.ok) return res.json();
                else throw new Error('Błąd podczas dodawania zadania');
            })
            .then(() => {
                setTitle('');
                setDescription('');
                setStatus('todo');
                setPriority('normal');
                setDueDate('');
                setMessage('Zadanie dodane');
                fetchTasks();
            })
            .catch(() => setMessage('Błąd podczas dodawania zadania'));
    };

    return (
        <div style={{ maxWidth: 900, margin: '20px auto' }}>
            <h2>Dodaj nowe zadanie</h2>
            <form onSubmit={handleAddTask} style={{ marginBottom: 20 }}>
                <div>
                    <input
                        type="text"
                        placeholder="Tytuł"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                        style={{ width: '100%', padding: 8, marginBottom: 10 }}
                    />
                </div>
                <div>
          <textarea
              placeholder="Opis"
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{ width: '100%', padding: 8, marginBottom: 10 }}
          />
                </div>
                <div style={{ marginBottom: 10 }}>
                    <label>Status: </label>
                    <select value={status} onChange={e => setStatus(e.target.value)}>
                        <option value="todo">Do zrobienia</option>
                        <option value="inprogress">W trakcie</option>
                        <option value="done">Zrobione</option>
                    </select>
                </div>
                <div style={{ marginBottom: 10 }}>
                    <label>Priorytet: </label>
                    <select value={priority} onChange={e => setPriority(e.target.value)}>
                        <option value="low">Niski</option>
                        <option value="normal">Normalny</option>
                        <option value="high">Wysoki</option>
                    </select>
                </div>
                <div style={{ marginBottom: 10 }}>
                    <label>Termin: </label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={e => setDueDate(e.target.value)}
                    />
                </div>
                <button type="submit" style={{ padding: '8px 16px' }}>Dodaj zadanie</button>
            </form>

            {message && <p>{message}</p>}

            <div style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
                <DragDropContext
                    onDragEnd={result => onDragEnd(result, columns, setColumns)}
                >
                    {Object.entries(columns).map(([columnId, column]) => (
                        <div
                            key={columnId}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                margin: 10,
                                border: "1px solid lightgrey",
                                borderRadius: 4,
                                width: 300,
                                minHeight: 500
                            }}
                        >
                            <h2>{column.name}</h2>
                            <Droppable droppableId={columnId} key={columnId}>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        style={{
                                            background: snapshot.isDraggingOver ? "lightblue" : "lightgrey",
                                            padding: 4,
                                            width: '100%',
                                            minHeight: 500,
                                            borderRadius: 4
                                        }}
                                    >
                                        {column.items.map((item, index) => (
                                            <Draggable
                                                key={item.id}
                                                draggableId={item.id.toString()}
                                                index={index}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                            userSelect: "none",
                                                            padding: 16,
                                                            margin: "0 0 8px 0",
                                                            minHeight: "50px",
                                                            backgroundColor: snapshot.isDragging ? "#263B4A" : "#456C86",
                                                            color: "white",
                                                            borderRadius: 4,
                                                            ...provided.draggableProps.style
                                                        }}
                                                    >
                                                        <strong>{item.title}</strong><br />
                                                        <small>{item.description}</small><br />
                                                        <small>Priorytet: {item.priority}</small><br />
                                                        <small>Termin: {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'brak'}</small>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </DragDropContext>
            </div>
        </div>
    );
}

export default KanbanBoard;
