//S3 이미지 경로
const IMG = 'https://syos-bucket.s3.ap-northeast-2.amazonaws.com/'
//카테고리 버튼
document.addEventListener("DOMContentLoaded", function () {
  const filter = document.querySelectorAll(".filter");

  filter.forEach(function (filterBtn) {
    filterBtn.addEventListener("click", function () {
      filter.forEach(function (btn) {
        btn.classList.remove("active");
      });
      this.classList.add("active");
    });
  });
});



// 페이지 렌더될 때 데이터 가져오기
const fetchData = async () => {
  const res = await axios({
    method: 'POST',
    url: '/board/all',
  });
  // console.log(res);

  // 게시물 생성
  for (let i = 0; i < res.data.length; i++) {
    const postCreate = document.createElement('div');
    const container = document.getElementById('mood-itemwrap');
    postCreate.classList.add('item-box');

    // 게시물과 post_id 연결
    postCreate.addEventListener('click', () => {
      location.href = `/board/${res.data[i].post_id}`;
    });

    postCreate.innerHTML = `
            <img src="${IMG + res.data[i].image}" />

              <div class="text-container">
                <div class="text-box">
                    <div class="title"> ${res.data[i].title}</div>
                </div>
              </div>   

              <div class="res-container">
                <div class="res-box">
                    <div class="heart-box">
                        <i class="fa-solid fa-heart" style="color: #000000;"></i>                          
                        <p class="liked">${res.data[i].liked}</p>
                    </div>
                    <div class="comment-box">
                        <i class="fa-solid fa-comment fa-flip-horizontal" style="color: #000000;"></i>
                        <p class="comment">${res.data[i].comment}</p>
                    </div>
                </div>
              </div>`;

    // 게시물 랜덤 페이드인 효과 (0.4초)
    const randomDelay = Math.floor(Math.random() * 400);
    postCreate.style.animation = `fadeIn 1s forwards ${randomDelay}ms`;

    container.appendChild(postCreate);
  }
};

fetchData();

// 버튼 선택할 때마다 axios로 값 보내주기
const filter = document.querySelectorAll('input[name="filter"]');
filter.forEach((filter) => {
  filter.addEventListener('change', async () => {
    const posts = await axios({
      method: 'POST',
      url: '/board/filter',
      data: { filter: filter.value },
    });
    // console.log(posts);
    const container = document.getElementById('mood-itemwrap');
    container.innerHTML = ``;
    // 게시물 생성
    for (let i = 0; i < posts.data.length; i++) {
      // console.log(i);
      const postCreate = document.createElement('div');
      postCreate.classList.add('item-box');
      // 게시물과 post_id 연결
      postCreate.addEventListener('click', () => {
        location.href = `/board/${posts.data[i].post_id}`;
      });

      postCreate.innerHTML = `
                <img src="${IMG + posts.data[i].image}" />

                
                <div class="text-container" >
                    <div class="text-box">
                        <div class="title">${posts.data[i].title}</div>
                    </div>
                </div>   
    
                <div class="res-container">
                    <div class="res-box">
                        <div class="heart-box">
                            <i class="fa-solid fa-heart" style="color: #000000;"></i>                           
                            <p class="liked">${posts.data[i].liked}</p>
                        </div>
                        <div class="comment-box">
                            <i class="fa-solid fa-comment fa-flip-horizontal" style="color: #000000;"></i>
                            <p class="comment">${posts.data[i].comment}</p>
                        </div>
                    </div>
                  </div>`;

      const randomDelay = Math.floor(Math.random() * 500);
      postCreate.style.animation = `fadeIn 2s forwards ${randomDelay}ms`;

      container.appendChild(postCreate);
    }
  });
});

// write 버튼 누르면 작성 페이지로 이동 
const write = document.querySelector(".write");
write.addEventListener('click', () => {
  axios({
    method: "GET",
    url: "/board/upload",
  }).then((res) => {
    location.href = "/board/upload";
  })
})