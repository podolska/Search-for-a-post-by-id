(() => {
    // Listen the form submit
    const form = document.querySelector('form');
    form.addEventListener('submit', showPost);

    // If form've been submitted - get post using API
    async function showPost(e) {
        e.preventDefault();
        // Get ID number from input
        const inputValue = document.querySelector('input').value;

        // If input is empty - show alert
        if (!inputValue) {
            alert('Ви не ввели ID поста. Спробуйте, будь-ласка, ще раз');
            return;
        };

        // Create promise with fetch to get post using ID from input
        const promise = new Promise(async (resolve, reject) => {
            try {
                const data = await fetch(`https://jsonplaceholder.typicode.com/posts/${inputValue}`);
                if (data) {
                    resolve(data.json());
                };
            } catch (error) {
                reject(`Вибачте, щось пішло не так: ${error}`);
            };
        });

        // Use this promise, create post card and put it to DOM
        promise
            .then(json => getPost(json))
            .catch(error => console.log(error));

        function getPost(data) {
            if (data) {
                //Create card for post
                const card = document.querySelector('.card');
                card.style.display = 'block';
                const text = `<h2 class="title">${data.title}</h2>
                            <p class="postText">${data.body}</p>
                            <button type="button" class="comments">Коментарі</button>`;
                card.innerHTML = text;

                // Create button to show comments
                const commentsButton = document.querySelector('.comments');
                commentsButton.addEventListener('click', showComments);

                async function showComments(e) {
                    e.preventDefault();

                    // Create promise to get comments
                    const promise = new Promise(async (resolve, reject) => {
                        try {
                            const data = await fetch(`https://jsonplaceholder.typicode.com/posts/${inputValue}/comments`);
                            if (data) {
                                resolve(data.json());
                            };
                        } catch (error) {
                            reject(`Вибачте, щось пішло не так: ${error}`);
                        };
                    });

                    promise
                        .then(data => getComments(data))
                        .catch(error => console.log(error));

                    function getComments(data) {
                        const commentsContainer = document.createElement('div');
                        // Map all comments and put in to DOM
                        data.map(el => {
                            const comment = document.createElement("div");
                            comment.classList.add("comment");
                            comment.innerHTML = `<p class="commentText">${el.body}</p>
                                            <p class="commentEmail">${el.email}</p>`;
                            commentsContainer.appendChild(comment);
                        });

                        card.appendChild(commentsContainer);
                    }
                };
            };
        }
    };

})();