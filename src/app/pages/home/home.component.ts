import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Tasks } from 'src/app/models/tasks';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  contStak = false;

  tasks: Tasks[] = [];
  filter: string = 'all';
  filteredTasks: Tasks[] = [];
  private routeSubscription: Subscription | undefined;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const savedTasks = localStorage.getItem('mydayapp-angular');
    this.tasks = savedTasks ? JSON.parse(savedTasks) : [];
    console.log('Loaded tasks:', this.tasks); // Agregar esto para depuración
    this.applyFilter(); // Aplicar el filtro al cargar

    // Suscribirse a los cambios en los parámetros de la URL
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.filter = params['filter'] || 'all'; // Si no hay filtro, usar 'all'
      this.applyFilter();
    });
  }

  saveTasks() {
    console.log('Saving tasks:', this.tasks); // Agregar esto para depuración
    localStorage.setItem('mydayapp-angular', JSON.stringify(this.tasks));
  }

  changeHandler(event: Event) {
    const input = event.target as HTMLInputElement;
    const newTitle = input.value.trim();

    if (newTitle) {
      this.addTask(newTitle);
    }

    this.ocultar();
    input.value = '';
  }

  addTask(newTitle: string) {
    const newTask: Tasks = {
      id: Date.now(),
      title: newTitle,
      completed: false,
    };
    this.tasks.push(newTask);
    this.applyFilter(); // Actualizar la lista filtrada
    this.saveTasks();
  }

  ocultar() {
    this.contStak = this.tasks.length > 0;
  }

  updateTask(id: number) {
    const taskToUpdate = this.tasks.find((task) => task.id === id);

    if (taskToUpdate) {
      taskToUpdate.completed = !taskToUpdate.completed;
    }

    this.applyFilter(); // Actualizar la lista filtrada
    this.saveTasks();
  }

  updadteTaskEditingMode(id: number) {
    this.tasks.forEach((task) => {
      task.editing = task.id === id;
    });
    this.applyFilter();
  }

  finishEdit(task: Tasks, event: Event) {
    const inputElement = event.target as HTMLInputElement | null;
    const newTitle = inputElement?.value.trim();

    if (newTitle) {
      task.title = newTitle;
    }

    task.editing = false;
    this.saveTasks();
  }

  changeFilter(filter: string) {
    this.filter = filter;
    this.applyFilter();
  }

  removeTask(id: number) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.applyFilter();
    this.saveTasks();
  }

  // Método que aplica el filtro según el estado actual
  applyFilter() {
    if (this.filter === 'all') {
      this.filteredTasks = this.tasks;
    } else if (this.filter === 'pending') {
      this.filteredTasks = this.tasks.filter((task) => !task.completed);
    } else if (this.filter === 'completed') {
      this.filteredTasks = this.tasks.filter((task) => task.completed);
    }
  }

  // Verificar si hay tareas completadas
  hasCompletedTasks(): boolean {
    return this.tasks.some((task) => task.completed);
  }

  // Limpiar tareas completadas
  clearCompleted() {
    this.tasks = this.tasks.filter((task) => !task.completed);
    this.applyFilter();
    this.saveTasks();
  }
}
