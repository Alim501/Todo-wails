import { Priority } from "./priority"

export interface UpdateTaskRequest {
  id: number
  title: string
  description: string
  priority: Priority
  due_at: Date | null
}