import { Priority } from "./priority"

export interface Task {
  id: number
  title: string
  description: string
  is_done: boolean
  due_at: string | null
  priority: Priority
  created_at: string
  updated_at: string
}