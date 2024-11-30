const submitButton = document.querySelector("input.submit");
submitButton.addEventListener("click", async() => {
    // Get values from the entry form
    const date = document.querySelector("input.date").value;

    const habitOfMind = document.getElementById("hom").value;

    const content = document.getElementById("content").value;
    const entry = {date, habit: habitOfMind, content};

    // Send a POST request to the router and wait for a response
    const response = await fetch("/createEntry", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(entry),
    });

    // If the response is ok, go back to the home page
    if (response.ok) {
        window.location = "/";
    } else {
        console.log("Error Creating Entry");
    }
});