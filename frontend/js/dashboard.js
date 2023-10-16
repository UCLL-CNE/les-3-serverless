const deleteLink = async (link) => {
    const response = await fetch(`${host}/mappings/${link.mapping}`, {
        headers: { ["Authorization"]: "Basic " + localStorage.getItem("Authorization"), },
        method: "DELETE",
    });


    if (response.status !== 200) {
        const result = await response.json();
        alert(result.message);
    } else {
        loadLinks();
    }
}

const loadLinks = async () => {
    const response = await fetch(`${host}/mappings`, {
        headers: {
            ["Authorization"]: "Basic " + localStorage.getItem("Authorization"),
        },
    });

    const links = await response.json();

    if (response.status !== 200) {
        alert(links.message);
    } else if (links.length === 0) {
        elements.linkTable.innerHTML = `<tr>
            <td colspan="3"><p>No link mappings yet.</p></td>
        </tr>`;
    } else {
        elements.linkTable.innerHTML = ``;
        links.forEach((link) => {
            const mappingCell = document.createElement("td");
            const linkCell = document.createElement("td");
            const buttonCell = document.createElement("td");

            buttonCell.innerHTML = `<button class="button" data-id="${link.id}">Delete</button>`;
            mappingCell.innerHTML = `<a target="_blank" href="${host}/l/${link.mapping}">${host}/l/${link.mapping}</a>`;
            linkCell.innerHTML = `<td>${link.link}</td>`;

            buttonCell.addEventListener("click", async (e) => {
                deleteLink(link);
            });

            const newRow = document.createElement("tr");
            newRow.appendChild(mappingCell);
            newRow.appendChild(linkCell);
            newRow.appendChild(buttonCell);

            elements.linkTable.appendChild(newRow);
        });
    }
}

const clearForm = () => {
    elements.linkInput.value = "";
    elements.mappingInput.value = "";
}

const createLink = async (link, mapping) => {
    const response = await fetch(`${host}/mappings/${mapping}`, {
        body: JSON.stringify({ link }),
        headers: {
            ["Content-Type"]: "application/json",
            ["Authorization"]: "Basic " + localStorage.getItem("Authorization"),
        },
        method: "PUT",
    });

    const result = await response.json();

    if (response.status !== 201) {
        alert(result.message);
    } else {
        loadLinks();
        clearForm();
    }
}

elements.createForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const link = elements.linkInput.value;
    const mapping = elements.mappingInput.value;
    createLink(link, mapping);
});

loadLinks();