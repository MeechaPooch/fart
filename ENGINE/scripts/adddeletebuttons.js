{
    const button = `
<img src="/.engine/images/red-x.svg" />
`

    document.querySelectorAll('.ITEM').forEach(item => {

        let deleteButton = document.createElement('div');
        deleteButton.classList.add('delete-button')
        deleteButton.innerHTML = button;
        deleteButton.onclick = e => {
            console.log('CLICKED!')
            // alert('CLICKED!')

            e.preventDefault();
            e.stopPropagation()
            e.stopImmediatePropagation();
            e.bubbles;

            async function doDelete() {
                let itemelem = e.target.closest('.ITEM')
                let filepath = itemelem.getAttribute('x-fullpath') ?? itemelem.getAttribute('href')
                let res = await window.API.deleteFile(filepath, SITE.getSiteUsername());

                if (await res.text() == 'reload') {
                    window.pagetrix.reload()
                }
            }
            doDelete();
        }

        if (!item.querySelector('.delete-button')) {
            item.appendChild(deleteButton);
        }
    })
}