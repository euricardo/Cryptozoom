const $form = document.forms.addPost;
const $postContent = document.getElementById("content");
const $editButton = document.querySelectorAll(".editButton"); //поиск всех кнопок

function createSound({ id, name, img, createdAt, like_count }) {
  return `
  <div data-postid=${id} class="card mb-3" style="max-width: 540px;">
  <div class="row g-0">
    <div class="col-md-4">
      <img src=${img} class="img-fluid rounded-start" >
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title" name='title'>${name}</h5>
        <p class="card-text"><small class="text-muted">Пост опубликован: ${createdAt}</small></p>
        
        <button type="button" class="btn-sm bg-dark editButton text-white" id=${id} data-type="edit">Редактировать</button>
        <button type="button" class="btn-sm bg-dark editButton text-white" id=${id}  data-type="delete">Удалить</button>
        <button type="button" class="btn-sm bg-danger editButton text-white" id=${id}  data-type="like">Like <small class="text-white mx-1">${like_count}</small></button>
        
        
      </div>
    </div>
  </div>
</div>
  `;
}
function editPost({ name, img }) {
  return `
  <form name="PostPost">
  <div class="mb-3">
    <label for="postTitle" class="form-label">Название поста</label>
    <input type="text" class="form-control" id="postTitle" name='title' value=${name}>
  </div>
  <div class="mb-3">
    <label for="img" class="form-label">Изображение</label>
    <input type="url" class="form-control" id="img" name='image' value=${img}>
  </div>
  <button type="submit" class="btn bg-dark text-white btn-primary">Редактировать</button>
</form>
  `;
}

$form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const inputData = Object.fromEntries(new FormData($form));

  const response = await fetch("/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(inputData),
  });
  if (response.status === 500) {
    alert("заполните все поля");
  }
  const result = await response.json();
  console.log(result);
  $postContent.insertAdjacentHTML("afterbegin", createSound(result));

  if (response.status === 200) {
    alert("пост успешно добавлен");
  }
});

$postContent.addEventListener("click", async (event) => {
  if (event.target.dataset.type === "delete") {
    let oneSound = event.target.closest("[data-postid]");
    let id = oneSound.dataset.postid;
    const response = await fetch("/add", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    if (response.ok) {
      oneSound.remove();
    } else {
      alert("у тебя ничего не выйдет Сноуден");
    }
  }
  if (event.target.dataset.type === "edit") {
    let currentPost = event.target.closest("[data-postid]"); //получаем полный элемент поста на который сделали клик
    const postId = currentPost.dataset.postid;
    const getPostResponse = await fetch(`/add/edit/${postId}`);
    if (getPostResponse.ok) {
      const postData = await getPostResponse.json();
      const { name, img } = postData;

      let newForm = currentPost.insertAdjacentHTML(
        "beforeend",
        editPost({ name, img })
      );
      const $currentPostForm = document.forms.PostPost;
      $currentPostForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const inputData = Object.fromEntries(new FormData($currentPostForm));
        const response = await fetch("/add", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: postId,
            name: inputData.title,
            img: inputData.image,
          }),
        });
        if (response.ok) {
          window.location.reload();
        }
      });
    }
  }
  if (event.target.dataset.type === "like") {
    let oneSound = event.target.closest("[data-postid]");
    let id = oneSound.dataset.postid;
    const response = await fetch(`/add/edit/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      event.target.querySelector("small").innerText =
        +event.target.querySelector("small").innerText + 1;
    } else {
      alert("Ваш лайк был учтен");
    }
  }
});
