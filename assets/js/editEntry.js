const changeButton = document.querySelector("input.submit");
const deleteButton = document.querySelector("input.delete");

changeButton.addEventListener("click", async() => {
    // Get values from the entry form
    const desc = document.getElementById("content").value;
    const entry = {content: desc, delete: false};

    // Send a POST request to the router and wait for a response
    const response = await fetch("/editEntry", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(entry),
    });

    // If the response is ok, go back to the home page
    if (response.ok) {
        window.location = "/";
    } else {
        console.log("Error Changing Entry");
    }
});

deleteButton.addEventListener("click", async() => {
    // Get values from the entry form
    const desc = document.getElementById("content").value;
    const entry = {content: desc, delete: true};

    // Send a POST request to the router and wait for a response
    const response = await fetch("/editEntry", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(entry),
    });

    // If the response is ok, go back to the home page
    if (response.ok) {
        window.location = "/";
    } else {
        console.log("Error Changing Entry");
    }
});