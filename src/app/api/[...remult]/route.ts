import { remultNextApp } from "remult/remult-next"
import { Task } from "../../../models/task"
import { TasksController } from "../../../components/TasksController"
import { createPostgresDataProvider } from "remult/postgres"
import { getUserOnServer } from "../auth/[...nextauth]/route"
import ably from "ably/promises"
import { AblySubscriptionServer } from "remult/ably"
import { DataProviderLiveQueryStorage } from "remult/server"

const dataProvider = createPostgresDataProvider({
  connectionString: process.env["POSTGRES_URL"] || process.env["DATABASE_URL"],
  configuration: {
    ssl: Boolean(process.env["POSTGRES_URL"]),
  },
})
const api = remultNextApp({
  entities: [Task],
  controllers: [TasksController],
  getUser: getUserOnServer,
  subscriptionServer: new AblySubscriptionServer(
    new ably.Rest(process.env["ABLY"]!)
  ),
  dataProvider,
  liveQueryStorage: new DataProviderLiveQueryStorage(dataProvider),
})
export const { GET, PUT, POST, DELETE } = api
