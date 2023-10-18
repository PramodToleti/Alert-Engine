import { Novu } from "@novu/node"
import cron from "node-cron"
import express from "express"
import morgan from "morgan"
import cors from "cors"
import axios from "axios"
import { v4 as uuidv4 } from "uuid"
import connectToDatabase from "./admin/index.js"
import { ObjectId } from "mongodb"

const novu = new Novu("95fb76645191cb6eb52637cb5385c2fb")

const app = express()

const port = process.env.PORT || 9000

app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

/* Creating a subscriber */

/* const id = uuidv4()
const subcriberId = id.replace(/-/g, "")

novu.subscribers
  .identify(subcriberId, {
    email: "pramod.toleti@sasi.ac.in",
    firstName: "Pramod",
    lastName: "Toleti",
    phone: "+919014717779",
  })
  .then((response) => {
    console.log(response.data)
  })
  .catch((error) => {
    console.log(error)
  })

const getSubscribers = () => {
  const options = {
    method: "GET",
    headers: {
      Authorization: '95fb76645191cb6eb52637cb5385c2fb',
    },
  }

  axios('https://api.novu.co/v1/subscribers', options)
    .then((response) => {
      console.log(response.json)
    })
    .catch((error) => {
      console.error(error)
    })
}
getSubscribers()

const userData = {
  users: [
    {
      role: "Technician",
      email: "pramod.toleti@sasi.ac.in",
      subscriber_id: "3bb075f3650d4901a0c3a3fcd27f22c0",
      alert_time: "09:00",
      intervals: 1,
      wait_time: 0,
    },
    {
      role: "Site Admin",
      email: "pramodraina047@gmail.com",
      subscriber_id: "650b3e2073891288fcde0edd",
      alert_time: "09:00",
      intervals: 2,
      wait_time: 2,
    },
  ],
}

const sendNotifications = () => {
  const currentMinute = new Date().getMinutes()
  console.log(`Current minute is ${currentMinute}`)

  for (const user of userData.users) {
    if (user.wait_time === 0) {
      console.log(
        `Sending notification to ${user.email} at ${currentMinute} minutes`
      )
      novu
        .trigger("alert-engine", {
          to: {
            subscriberId: user.subscriber_id,
            email: user.email,
          },
          payload: {
            message: `Hi ${user.role}, this is a test notification from Novu`,
          },
        })
        .then((res) => {
          console.log(res.data)
          user.wait_time += user.intervals - 1
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      console.log("No notifications to send")
      if (user.wait_time > 0) {
        user.wait_time -= 1
      }
    }
  }
}

cron.schedule("* * * * *", sendNotifications) */

app.get("/", (req, res) => {
  res.send("Hello from server!")
})

app.get("/api/users", async (req, res) => {
  try {
    const db = await connectToDatabase()
    const collection = db.collection("users")
    const users = await collection.find({}).toArray()
    if (users) {
      res.json(users)
    } else {
      res.status(404).json({ error: "Users not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.get("/api/orgs", async (req, res) => {
  try {
    const db = await connectToDatabase()
    const collection = db.collection("organizations")
    const orgs = await collection.find({}).toArray()
    if (orgs) {
      res.json(orgs)
    } else {
      res.status(404).json({ error: "Organizations not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.get("/api/zones", async (req, res) => {
  try {
    const db = await connectToDatabase()
    const collection = db.collection("zones")
    const zones = await collection.find({}).toArray()
    if (zones) {
      res.json(zones)
    } else {
      res.status(404).json({ error: "Zones not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.get("/api/zones/:id", async (req, res) => {
  try {
    const db = await connectToDatabase()
    const collection = db.collection("zones")
    const orgId = new ObjectId(req.params.id)

    const zones = await collection.find({ org_id: orgId }).toArray()

    if (zones.length > 0) {
      res.json(zones)
    } else {
      res.status(404).json({ error: "No matching zones found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.get("/api/sites", async (req, res) => {
  try {
    const db = await connectToDatabase()
    const collection = db.collection("sites")
    const sites = await collection.find({}).toArray()
    if (sites) {
      res.json(sites)
    } else {
      res.status(404).json({ error: "Sites not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.get("/api/sites/:id", async (req, res) => {
  try {
    const db = await connectToDatabase()
    const collection = db.collection("sites")
    const zone_id = new ObjectId(req.params.id)

    const sites = await collection.find({ zone_id }).toArray()

    if (sites.length > 0) {
      res.json(sites)
    } else {
      res.status(404).json({ error: "No matching zones found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.get("/api/roles", async (req, res) => {
  try {
    const db = await connectToDatabase()
    const collection = db.collection("roles")
    const roles = await collection.find({}).toArray()
    if (roles) {
      res.json(roles)
    } else {
      res.status(404).json({ error: "Roles not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.get("/api/userRoles", async (req, res) => {
  try {
    const db = await connectToDatabase()
    const collection = db.collection("userRoles")
    const userRoles = await collection.find({}).toArray()
    if (userRoles) {
      res.json(userRoles)
    } else {
      res.status(404).json({ error: "User roles not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
})

//Policies
app.post("/api/policies", async (req, res) => {
  try {
    const db = await connectToDatabase()
    const collection = db.collection("policies")
    const newPolicy = req.body
    console.log(newPolicy)
    const result = await collection.insertOne(newPolicy)
    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.get("/api/policies", async (req, res) => {
  try {
    const db = await connectToDatabase()
    const collection = db.collection("policies")
    const allPolicies = await collection.find({}).toArray()
    res.json(allPolicies)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.get("/api/policies/:id", async (req, res) => {
  try {
    const db = await connectToDatabase()
    const collection = db.collection("policies")
    const policy = await collection
      .find({
        org_id: req.params.id,
      })
      .toArray()
    if (!policy) {
      return res.status(404).json({ error: "Policy not found" })
    }
    res.json(policy)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.put("/api/policies/:id", async (req, res) => {
  try {
    const db = await connectToDatabase()
    const collection = db.collection("policies")
    const updatedPolicy = req.body
    const result = await collection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updatedPolicy }
    )
    console.log(result)
    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "Policy not found" })
    }
    res.json({ message: "Policy updated successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.delete("/api/policies/:id", async (req, res) => {
  try {
    const db = await connectToDatabase()
    const collection = db.collection("policies")
    const result = await collection.deleteOne({
      _id : new ObjectId(req.params.id),
    })
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Policy not found" })
    }
    res.json({ message: "Policy deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
