// Supabase init
const SUPABASE_URL = "https://shihhijsqpypgsjagqle.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoaWhoaWpzcXB5cGdzamFncWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDA4NDMsImV4cCI6MjA3MTI3Njg0M30.rNM6LjZ5gUk4KT2s6OeWVEDJmIIKILFvtCh4Wop2XQk";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  let { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    alert("Ошибка: " + error.message);
  } else {
    alert("Регистрация успешна! Подтверди email.");
  }
}

async function signIn() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  let { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    alert("Ошибка: " + error.message);
  } else {
    alert("Вход успешен!");
    document.getElementById("postBox").style.display = "block";
    loadPosts();
  }
}

async function createPost() {
  const postContent = document.getElementById("postContent").value;
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) {
    alert("Сначала войдите!");
    return;
  }
  let { error } = await supabase.from("posts").insert([
    { user_id: user.id, content: postContent }
  ]);
  if (error) {
    alert("Ошибка: " + error.message);
  } else {
    document.getElementById("postContent").value = "";
    loadPosts();
  }
}

async function loadPosts() {
  let { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    alert("Ошибка загрузки постов: " + error.message);
    return;
  }
  const feed = document.getElementById("feed");
  feed.innerHTML = "";
  posts.forEach(post => {
    let div = document.createElement("div");
    div.className = "post";
    div.innerText = post.content;
    feed.appendChild(div);
  });
}