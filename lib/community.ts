import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  where, 
  Timestamp,
  limit,
  doc,
  deleteDoc,
  serverTimestamp,
  updateDoc,
  increment
} from 'firebase/firestore';

export interface PostData {
  title: string;
  author: string;
  userId: string; // 작성자 고유 ID (Auth 연동용)
  content: string;
  category: string;
  likes: number;
  comments: number;
  timestamp: Timestamp;
  isHot?: boolean;
  imageUrl?: string;
  fileUrl?: string;
  fileName?: string;
  verificationStatus?: 'pending' | 'verified' | 'community' | 'none';
}

export interface CommentData {
  id: string;
  userId: string;
  author: string;
  content: string;
  timestamp: Timestamp;
}

const COLLECTION_NAME = 'treia_community_posts';

/**
 * 신규 게시물을 작성합니다.
 */
export async function createPost(post: Omit<PostData, 'timestamp' | 'likes' | 'comments'>) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...post,
      likes: 0,
      comments: 0,
      timestamp: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating post:", error);
    return null;
  }
}

/**
 * 게시물 목록을 가져옵니다.
 */
export async function getPosts(category: string = "전체") {
  try {
    let q;
    if (category === "전체") {
      q = query(collection(db, COLLECTION_NAME), orderBy('timestamp', 'desc'), limit(20));
    } else {
      q = query(
        collection(db, COLLECTION_NAME), 
        where('category', '==', category),
        orderBy('timestamp', 'desc'),
        limit(20)
      );
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

/**
 * 파일을 업로드하고 URL을 반환합니다.
 */
export async function uploadFile(file: File, path: string) {
  try {
    const storageRef = ref(storage, `treia/${path}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return { url: downloadURL, name: file.name };
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
}

/**
 * 게시물을 삭제합니다.
 */
export async function deletePost(postId: string) {
  try {
    const postRef = doc(db, COLLECTION_NAME, postId);
    await deleteDoc(postRef);
    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    return false;
  }
}

// 댓글 추가
export async function addComment(postId: string, userId: string, author: string, content: string) {
  try {
    const postRef = doc(db, COLLECTION_NAME, postId);
    const commentsRef = collection(postRef, 'comments');
    await addDoc(commentsRef, {
      userId,
      author,
      content,
      timestamp: serverTimestamp(),
    });

    // 댓글 수 업데이트
    await updateDoc(postRef, {
      comments: increment(1)
    });
    return true;
  } catch (error) {
    console.error("Add Comment Error:", error);
    return false;
  }
}

// 댓글 목록 가져오기
export async function getComments(postId: string) {
  try {
    const postRef = doc(db, COLLECTION_NAME, postId);
    const commentsRef = collection(postRef, 'comments');
    const q = query(commentsRef, orderBy("timestamp", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Get Comments Error:", error);
    return [];
  }
}

// 검증 요청 (상태 업데이트)
export async function requestVerification(postId: string) {
  try {
    const postRef = doc(db, COLLECTION_NAME, postId);
    await updateDoc(postRef, {
      verificationStatus: 'pending'
    });
    return true;
  } catch (error) {
    console.error("Request Verification Error:", error);
    return false;
  }
}
