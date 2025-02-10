interface Task {
    title: string
}
const baseApiUrl = 'https://tasks.googleapis.com/tasks/v1'

export async function addTasks({ tasks, description, }: { tasks: Task[], description: string }) {
    const { token } = await chrome.identity.getAuthToken({ interactive: true })
    // console.log(token);
    let res = await fetch(`${baseApiUrl}/users/@me/lists?maxResults=1`, { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) {
        console.error(await res.text())
        throw new Error('Failed to get task list')
    }
    const tasklist = await res.json()
    const results = await _addParentTask({ task: { title: description }, subTasks: tasks, taskListId: tasklist.items[0].id, token })

    return { results }
}

async function _addParentTask({ task, subTasks, taskListId, token }: { task: Task, subTasks: Task[], taskListId: string, token: string }) {
    const res = await fetch(`${baseApiUrl}/lists/${taskListId}/tasks`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })
    if (!res.ok) {
        console.error(await res.text())
        throw new Error('Failed to add tasks')
    }
    const parentTask = await res.json()
    const results = Array<any>()
    results.push(parentTask)
    for (const subTask of subTasks) {
        const result = await _addSubTasks({ task: subTask, taskListId, parent: parentTask.id, token })
        results.push(result)
    }
    return { results }
}
async function _addSubTasks({ task, taskListId, token, parent }: { task: Task, taskListId: string, parent: string, token: string }) {
    let res = await fetch(`${baseApiUrl}/lists/${taskListId}/tasks`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })
    if (!res.ok) {
        console.error(await res.text())
        throw new Error('Failed to add tasks')
    }
    const createdTask = await res.json()
    // console.log('createdTask', createdTask)
    res = await fetch(`${baseApiUrl}/lists/${taskListId}/tasks/${createdTask.id}/move?parent=${parent}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    })
    if (!res.ok) {
        console.error(await res.text())
        throw new Error('Failed to move task')
    }
    // console.log('moved task')
    return createdTask
}