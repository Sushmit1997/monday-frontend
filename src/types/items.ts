export type ColumnValue = {
  id: string
  text: string
  value: string | null
}

export type MondayItem = {
  id: string
  name: string
  column_values: ColumnValue[]
}

export type ItemsResponse = {
  success: boolean
  data: MondayItem[]
}
