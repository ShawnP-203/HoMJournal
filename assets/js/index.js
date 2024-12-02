const filter = document.getElementById("filter");
const filterButton = document.querySelector("button.filterButton");

filterButton.addEventListener("click", async() => {
    let q = "/?filter=" + filter.value.replaceAll(" ", "+");
    const response = await fetch(q, {
        method: "GET",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
    });

    if(response.ok)
        window.location = q;
    else
        console.log("Error Filtering Entries");
});