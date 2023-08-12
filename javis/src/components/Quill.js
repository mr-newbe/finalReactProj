/*
import dynamic from 'next/dynamic';

const ReactQuill = dynamic( () => import('react-quill'), {
    ssr : false
})
*/

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import {useMemo, useRef, useState} from "react";
import {storage} from "../Firebase";
import {uploadBytes, getDownloadURL, ref} from "firebase/storage";



export default function QuillEditor(){
    const quillRef = useRef();
    const [content, setContent] = useState("");

    
    
    const imageHandler = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();
        input.addEventListener("change", async () => {
          const editor = quillRef.current.getEditor();
          const file = input.files[0];
          const range = editor.getSelection(true);
          try {
            // 파일명을 "image/Date.now()"로 저장
            const storageRef = ref(
              storage,
              `image/${Date.now()}`
            );
            // Firebase Method : uploadBytes, getDownloadURL
            await uploadBytes(storageRef, file).then((snapshot) => {
              getDownloadURL(snapshot.ref).then((url) => {
                // 이미지 URL 에디터에 삽입
                editor.insertEmbed(range.index, "image", url);
                // URL 삽입 후 커서를 이미지 뒷 칸으로 이동
                editor.setSelection(range.index + 1);
              });
            });
          } catch (error) {
            console.log(error);
          }
        });
      };

    const modules = useMemo(() => {
        return {
          toolbar: {
            container: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline", "strike"],
              ["blockquote"],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ color: [] }, { background: [] }],
              [{ align: [] }, "link", "image"],
            ],
            handlers:{
                image: imageHandler,
            }
          },
        }
      }, [])

      
    

    return(
        <div className='quillContainer'>
            <ReactQuill
                style={{ width: "600px", height: "450px" }}
                placeholder="Quill Content"
                theme="snow"
                ref={quillRef}
                value={content}
                onChange={setContent}
                modules={modules}
            />
        </div>
    )
}