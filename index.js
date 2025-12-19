#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, "tasks.json");

function readTasks() {
    if (!fs.existsSync(FILE_PATH)) {
        fs.writeFileSync(FILE_PATH, '[]');
    }

    const tasks = fs.readFileSync(FILE_PATH);
    return JSON.parse(tasks)
}

function writeTasks(tasks) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 4));
}

function addTask(task) {
    let tasks = readTasks();
    const newTask = {
        id: tasks.length === 0 ? 1 : (tasks.length + 1),
        task,
        status: 'todo',
        createdAt: new Date().toUTCString(),
        updadtedAt: new Date().toUTCString(),
    }

    tasks.push(newTask);
    writeTasks(tasks);
    console.log(`Task successfully added! (ID: ${newTask.id})`);
}

function listTask(filterStatus) {
    let tasks = readTasks();
    if(tasks.length === 0) {
        console.log("No task found.")
        return;
    }
    if (filterStatus) {
        tasks.forEach(task => {
            if (task.status === filterStatus)
                console.log(`[${task.id}] ${task.task} (Status: ${task.status}) - Updated at: ${task.updadtedAt}`);
        });
    }
    else {
        tasks.forEach(task => {
            console.log(`[${task.id}] ${task.task} (Status: ${task.status}) - Updated at: ${task.updadtedAt}`);
        });
    }
}

function updateTask(targetId, newTask) {
    let tasks = readTasks();
    let task = tasks.find(t => t.id === targetId);
    if (!task) {
        console.log("Task not found.");
        return;
    }
    task.task = newTask;
    task.updadtedAt = new Date().toUTCString();
    writeTasks(tasks);
    console.log("Task successfully updated.");
    return;
}

function deleteTask(targetId) {
    let tasks = readTasks();
    let task = tasks.filter(t => t.id !== targetId);
    if (task.length === tasks.length) {
        console.log("Task not found.");
        return;
    }
    writeTasks(task);
    console.log("Task successfully deleted");
    return;
}

function markProgress(targetId) {
    let tasks = readTasks();
    let task = tasks.find(t => t.id === targetId);
    if (!task) {
        console.log("Task not found");
        return;
    }
    task.status = "in-progress";
    task.updadtedAt = new Date().toUTCString();
    writeTasks(tasks);
    console.log("Task successfully updated.");
    return;
}

function markDone(targetId) {
    let tasks = readTasks();
    let task = tasks.find(t => t.id === targetId);
    if (!task) {
        console.log("Task not found");
        return;
    }
    task.status = "done";
    task.updadtedAt = new Date().toUTCString();
    writeTasks(tasks);
    console.log("Task successfully updated.");
    return;
}

const args = process.argv.slice(2);
const command = args[0];

let task;
let id;
switch (command) {
    case 'add':
        task = "";
        for (let i = 1; i < args.length; i++) {
            task = task + args[i] + (i === (args.length - 1) ? "" : " ");
        }
        addTask(task);
        break;
    case 'list':
        let filterStatus = "";
        for (let i = 1; i < args.length; i++) {
            filterStatus = filterStatus + args[i] + (i === (args.length - 1) ? "" : " ");
        }
        listTask(filterStatus);
        break;
    case 'update':
        task = "";
        id = Number(args[1]);
        for (let i = 2; i < args.length; i++) {
            task = task + args[i] + (i === (args.length - 1) ? "" : " ");
        }
        updateTask(id, task);
        break;
    case 'delete':
        id = Number(args[1]);
        deleteTask(id);
        break;
    case 'mark-in-progress':
        id = Number(args[1]);
        markProgress(id);
        break;
    case 'mark-done':
        id = Number(args[1]);
        markDone(id);
        break;
    default:
        console.log("Option: add|list|update|delete|mark-in-progress|mark-done");
}