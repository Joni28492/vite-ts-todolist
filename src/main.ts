import {v4} from 'uuid';
import Toastify from 'toastify-js';

import "toastify-js/src/toastify.css";
import './style.css';



// https://www.youtube.com/watch?v=rsV0zmpfKrY&t=263s   min 47:48
const taskForm = document.querySelector<HTMLFormElement>('#taskForm')


const tasksList = document.querySelector<HTMLDivElement>('#tasksList')


interface Task {
    title: string,
    description: string,
    id: string,
}

let tasks:Task[] = []

taskForm?.addEventListener('submit', (e)=>{
    e.preventDefault();

    const title = taskForm['title'] as unknown as HTMLInputElement
    const description = taskForm['description'] as unknown as HTMLTextAreaElement

    tasks.push({
        title: title.value,
        description: description.value,
        id: v4(),
    })

    localStorage.setItem('tasks', JSON.stringify(tasks))

    //alerta toastify
    Toastify({
        text: 'Task added',
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
    }).showToast();

    //renderizar nuevamente 
    renderTasks(tasks)


    // limipiar formulario
    taskForm.reset()
    title.focus()
})


document.addEventListener('DOMContentLoaded', ()=>{
   tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
   renderTasks(tasks)
})


const renderTasks = (tasks:Task[]) =>{

    tasksList!.innerHTML=''

    tasks.forEach(task => {
        const taskElement = document.createElement('div')
        taskElement.className = 'bg-zinc-800 mb-1 p-4 rounded-lg hover:bg-zinc-700 hover:cursor-pointer'

        const header = document.createElement('header')
        header.className='flex justify-between'
        const title = document.createElement('span')
        title.innerText = task.title

        const btnDelete = document.createElement('button');
        btnDelete.className='bg-red-500 px-2 py-1 rounded-md'
        btnDelete.innerText='Delete'


        btnDelete.addEventListener('click', ()=>{
            //obtenemos el indice de la tarea
            const index = tasks.findIndex(t=>t.id===task.id)
            tasks.splice(index, 1)
            localStorage.setItem('tasks', JSON.stringify(tasks))
            renderTasks(tasks)

            Toastify({
                text: 'Task deleted',
                style: {
                    background: "linear-gradient(to right, #e8422c, #ebd34b)",
                  },
            }).showToast()
        })
        
        header.append(title)
        header.append(btnDelete)
        
        const description = document.createElement('p')
        description.innerText = task.description;
        
        taskElement.append(header)
        taskElement.append(description)

        const id = document.createElement('p');
        id.innerText = task.id;
        id.className = 'text-gray-400 text-xs'
        taskElement.append(id)

        tasksList?.append(taskElement)
    });
}
