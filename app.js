const ul = document.querySelector('ul');
const form = document.querySelector('form');
const button = document.querySelector('button');

const getRecipe = (recipe, id) => {
  const { title, created_at } = recipe;
  const time = created_at.toDate();
  const html = `
  <li class='bg-warning m-2 p-2' data-id='${id}'>
  <div>${recipe.title}</div>
  <div>${time}</div>
  <button class='btn btn-danger btn-sm my-2'>Delete</button>
  </li>
  `;
  ul.innerHTML += html;
};
const deleteRecipe = (id) => {
  const li = document.querySelectorAll('li');
  li.forEach((recipe) => {
    if (recipe.getAttribute('data-id') === id) {
      recipe.remove();
    }
  });
};

// get data
const unsub = db.collection('recipes').onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((changes) => {
    const doc = changes.doc;
    if (changes.type === 'added') {
      getRecipe(doc.data(), doc.id);
    } else if (changes.type === 'removed') {
      deleteRecipe(doc.id);
    }
  });
});

// add data
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const now = new Date();
  const recipe = {
    title: form.recipe.value.trim(),
    created_at: firebase.firestore.Timestamp.fromDate(now),
  };
  db.collection('recipes')
    .add(recipe)
    .then(() => console.log('recipe added'))
    .catch((err) => console.log(err));
});

// delete data
ul.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    const id = e.target.parentElement.getAttribute('data-id');
    db.collection('recipes')
      .doc(id)
      .delete()
      .then(() => console.log('recipe deleted'))
      .catch((err) => console.log(err));
  }
});
// unsub from changes
button.addEventListener('click', () => {
  unsub();
});
