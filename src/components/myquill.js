import Quill from 'quill/dist/quill.js';
import Snow from 'quill/themes/snow.js';
import React, { Component, Fragment } from 'react';
import axios from 'axios';
import * as getConf from '../../src/conf.js';
import ImageResize from 'quill-image-resize-module';


let quill;


class MyQuill extends Component {

  constructor(props) {
    super(props);

    this.state = {
      content: '',
    };
Quill.register('modules/imageResize', ImageResize);
//Quill.register('ImageResize.js', ImageResize);
    Quill.register({
      'themes/snow.js': Snow,
    });
  }


  componentDidMount(props) {

    if(this.props.content) {
      this.setState({content: this.props.content});
    }

    quill = new Quill('#editor', {
      theme: 'snow',
      formats: ['bold', 'italic', 'color', 'image','underline','blockquote','strike','code','header','link'],
      modules: {
        imageResize: true,
        toolbar: {
           container: [['bold', 'italic', 'underline', 'blockquote','strike','code',{header: 1},{header: 2}],
           [ { 'color': ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466', 'custom-color'] }],
           ['image','link'],
           ],
           handlers: {
             'image': this.selectLocalImage
           }
         }
       }
     }
  );


  quill.on('text-change', (delta, oldDelta, source) => {

    let content = this.getHTML();
    this.setState({content: content});
    this.handleContentChange();

    if (source === 'api') {
    } else if (source === 'user') {
      }
  }
);

  // usages
  this.setHTML(this.props.content);
  //console.log(this.props.content);
  this.setState({content: this.props.content});
  }

  componentDidUpdate(prevState,prevProps) {

          if(prevState.content !== this.props.content ) {
          //  console.log("prevProps.content !== this.props.content");

            let content = this.getHTML();
            this.setState({content: content})
                this.setHTML(this.props.content);
          }
  }


  // set html content
setHTML = (html) => {
  quill.root.innerHTML = html;
};

// get html content
getHTML = () => {
  return quill.root.innerHTML;
};

handleContentChange = () => {
  if(this.props.onContentChange) {
    this.props.onContentChange(this.state.content);
  }
};

handleWarningChange = (e) => {
  if(this.props.onWarningChange) {
    this.props.onWarningChange(true, "błąd", "Przekroczono maksymalny rozmiar pliku > 512kb");
  }
};


  selectLocalImage = ()=> {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.click();

        // Listen upload local image and save to server
        input.onchange = () => {
          const file = input.files[0];

          // file type is only image.
          if (/^image\//.test(file.type)) {
            this.saveToServer(file);
          } else {
            console.warn('You could only upload images.');
          }
        };
      };


    saveToServer = (file)=> {
        const fd = new FormData();
        fd.append('image', file);
        axios.post(getConf('api_url_base')+'/api/upload/', fd,{
      headers: {
        'Content-Type': 'multipart/form-data',
      }, withCredentials: true

  })
        .then(res=>{
  let img = res.data.path+res.data.filename;
  //console.log("img", img);

  this.insertToEditor(img);
        })
        .catch((e)=>{

        console.log(e);
this.handleWarningChange(e);


          if(e.response) {
      if( e.response.status === 401) {
        this.setState({isauthenticated: false});
            }}
          });
      };
      // Step3. insert image url to rich editor.

      insertToEditor(url) {
          // push image url to rich editor.
          const range = quill.getSelection();
          quill.insertEmbed(range.index, 'image', url);
        }


  render() {
    return (
      <Fragment>

      <div id="editor">

      </div>
      </Fragment>
    );
  }
}
export default MyQuill;
