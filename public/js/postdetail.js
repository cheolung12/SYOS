const IMG = `https://syos-test2.s3.ap-northeast-2.amazonaws.com/`;
const heart = document.querySelector('.fa-heart');
const heartNum = document.querySelector('#heart-number');
const commentNum = document.querySelector('#comment-number');
const idBox = document.getElementById('post_id');
const post_id = idBox.textContent;
const modifyPost = document.getElementById('modify');
const deletePost = document.getElementById('delete');

let user_id;
let nickName;
let postUserId;

// axios로 필요한 데이터 요청
const token = localStorage.getItem('token');
const fetchData = async () => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/board/detail',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        post_id,
      },
    });
    console.log(res);
    // 데이터 불러와서 렌더링
    const writerNickname = document.querySelector('.header-nickname');
    const postImage = document.querySelector('.post-img');
    const postContent = document.querySelector('#post-content');
    const commentList = document.querySelector('#comment-list');
    writerNickname.textContent = `@${res.data.nickName}`;
    postImage.src = `${IMG + res.data.postData.image}`;
    nickName = res.data.currentUserNickname;
    user_id = res.data.currentUserId;
    postUserId = res.data.user_id;

    // 수정, 삭제 버튼 활성화 여부
    if (user_id === postUserId) {
      // 보이고, 링크 설정
      modifyPost.style.display = 'block';
      deletePost.style.display = 'block';
      modifyPost.addEventListener('click', () => {
        location.href = `/board/${post_id}/edit`;
      });
      deletePost.addEventListener('click', async () => {
        const confirmation = confirm('삭제하시겠습니까?');
        if (confirmation) {
          await axios({
            method: 'DELETE',
            url: `/board/${post_id}/delete`,
            data: { post_id },
          })
          alert('삭제되었습니다.'); 
        } 
      });
    } else {
      // 안 보이고 링크 설정 x
      modifyPost.style.display = 'none';
      deletePost.style.display = 'none';
    }

    if (res.data.isHeart.length !== 0) {
      heart.classList.remove('fa-regular');
      heart.classList.add('fa-solid');
      heart.style.color = '#ec4141';
    }

    heartNum.textContent = res.data.postData.liked;
    commentNum.textContent = res.data.postData.comment;
    postContent.textContent = res.data.postData.content;

    // 댓글 렌더링
    for (let i = 0; i < res.data.comments.length; i++) {
      const commentBox = document.createElement('li');
      const commentWriter = document.createElement('div');
      const commentText = document.createElement('div');
      commentBox.classList.add('comment-box');
      commentWriter.classList.add('user-name');
      commentText.classList.add('user-comment');
      commentWriter.textContent = `@${res.data.commentNickname[i]}`;
      commentText.textContent = `${res.data.comments[i].content}`;
      commentBox.appendChild(commentWriter);
      commentBox.appendChild(commentText);
      commentList.appendChild(commentBox);
    }
  } catch (error) {
    console.error(error);
  }
};

// 페이지 로드될 때 실행
fetchData();

// 좋아요 누를 때 UI 변경 및 DB 업데이트
heart.addEventListener('click', async () => {
  let isHeart;
  if (heart.classList.contains('fa-solid')) {
    heart.classList.remove('fa-solid');
    heart.classList.add('fa-regular');
    heart.style.color = '';
    isHeart = false;
  } else {
    heart.classList.remove('fa-regular');
    heart.classList.add('fa-solid');
    heart.style.color = '#ec4141';
    isHeart = true;
  }
  const res = await axios({
    method: 'PATCH',
    url: '/board/detail/heart',
    data: { post_id, isHeart, user_id },
  });
  const number = res.data.heartNum;
  heartNum.textContent = `${number}`;
});

// 댓글 입력
const addComment = async (e) => {
  e.preventDefault();
  const comments = document.getElementById('comments');
  const content = comments.value;

  if (!nickName) {
    alert('로그인이 필요합니다.');
    comments.value = '';
    return;
  }
  if (content.trim() === '') {
    alert('Please enter comments.');
    return;
  }

  const result = await axios({
    method: 'POST',
    url: '/board/detail/comment',
    data: {
      post_id,
      user_id,
      content,
    },
  });
  if (result.data.result) {
    const commentList = document.getElementById('comment-list');
    const commentBox = document.createElement('li');
    const commentWriter = document.createElement('div');
    const commentText = document.createElement('div');
    commentBox.classList.add('comment-box');
    commentWriter.classList.add('user-name');
    commentText.classList.add('user-comment');
    commentWriter.textContent = `@${nickName}`;
    commentText.textContent = content;
    commentBox.appendChild(commentWriter);
    commentBox.appendChild(commentText);
    commentList.appendChild(commentBox);
    comments.value = '';
  }
};