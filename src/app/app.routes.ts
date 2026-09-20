  import { Routes } from '@angular/router';
  import { TaskListComponent } from './components/task-list/task-list.component';
  import { TaskCreateComponent } from './components/task-create/task-create.component';
  import { TaskEditComponent } from './components/task-edit/task-edit.component';

  export const routes: Routes = [
    { path: '', component: TaskListComponent },
    { path: 'create', component: TaskCreateComponent },
    { path: 'edit/:id', component: TaskEditComponent }
  ];