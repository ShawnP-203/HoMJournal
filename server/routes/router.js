const express = require("express");
const route = express.Router();
const Entry = require("../model/entry");
// Just importing emitNewEntry from socket
const {emitNewEntry, emitEdit, emitDeletion} = require("../socket/socket");

// JSON is an easy way to store static data
const habitsOfMind = require("../model/habitsOfMind.json");

// Pass a path ("/") and callback function => {}
// When the client makes at HTTP GET request to this path
// the callback function is executed
route.get("/", async (req, res) => {
    // The await keyword pauses the function until the line is done
    const entries = await Entry.find();

    // Convert MongoDB objects to objects formatted for EJS
    const formattedEntries = entries.map((entry) => {
        return {
            id: entry._id,
            date: entry.date.toLocaleDateString(),
            habit: entry.habit,
            content: entry.content.slice(0, 20) + "...",
        };
    }).sort((a, b) => {
        let date1 = a.date.split("/");
        let date2 = b.date.split("/");
        for(let i = 0; i < 3; i++)
        {
            date1[i] = parseInt(date1[i]);
            date2[i] = parseInt(date2[i]);
        }
        for(let i = 2; i < 5; i++)
        {
            if(date1[i%3] < date2[i%3])
                return 1; //The sort is in reverse to show dates in descending order
            else if(date1[i%3] > date2[i%3])
                return -1;
        }
        return 0;
    });

    if(req.query.filter !== undefined)
    {
        for(let i = 0; i < formattedEntries.length; i++)
        {
            if(formattedEntries[i].habit !== req.query.filter)
                formattedEntries.splice(i--, 1);
        }
    }

    // The res parameter references the HTTP response object
    res.render("index", {
        entries: formattedEntries,
        habits: habitsOfMind,
        filter: req.query.filter,
    });
});

route.get("/createEntry", (req, res) => {
    // Send the HoM object to the createEntry view
    res.render("createEntry", {habits: habitsOfMind});
});

// Handle the POST request for creating new entries
route.post("/createEntry", async (req, res) => {
    const entry = new Entry({
        date: req.body.date,
        email: req.session.email,
        habit: req.body.habit,
        content: req.body.content,
    });

    // Save the new entry to the MongoDB database
    await entry.save();

    // Send this new entry to all connected clients
    emitNewEntry({
        id: entry._id,
        date: entry.date.toLocaleDateString(),
        habit: entry.habit,
        content: entry.content.slice(0, 20) + "...",
    });

    // Send a response of "ok"
    res.status(201).end();
});

// Edit an entry with the id given as a parameter
// Currently this just logs the entry to be edited
route.get("/editEntry/:id", async (req, res) => {
    res.render("editEntry", {entry: await Entry.findById(req.params.id)});
});

route.post("/editEntry/:id", async (req, res) => {
    const entry = await Entry.findById(req.params.id);
    if(req.body.delete)
    {
        emitDeletion({
            id: entry._id,
            date: entry.date.toLocaleDateString(),
            habit: entry.habit,
            content: entry.content.slice(0, 20) + "...",
        });
        
        await Entry.deleteOne({
            date: entry.date,
            email: entry.email,
            habit: entry.habit,
            content: entry.content,
        });
    }
    else
    {
        await Entry.updateOne({
            date: entry.date,
            email: entry.email,
            habit: entry.habit,
            content: entry.content,
        },
        {
            date: entry.date,
            email: entry.email,
            habit: entry.habit,
            content: req.body.content,
        });

        emitEdit({
            id: entry._id,
            date: entry.date.toLocaleDateString(),
            habit: entry.habit,
            content: entry.content.slice(0, 20) + "...",
        });
    }
    res.status(201).end();
});

// Delegate all authentication to the auth.js router
route.use("/auth", require("./auth"));



module.exports = route;