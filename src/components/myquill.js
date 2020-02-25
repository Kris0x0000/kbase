import Quill from 'quill/dist/quill.js';
import Toolbar from 'quill/modules/toolbar.js';
import Snow from 'quill/themes/snow.js';
import React, { Component, Fragment } from 'react';
import axios from 'axios';
import * as getConf from '../../src/conf.js';


let quill;

class MyQuill extends Component {

  constructor(props) {
    super(props);

    this.state = {
      content: '',
    };

    Quill.register({
      'themes/snow.js': Snow,
    });

    //let image = Quill.import('formats/image.js');
//  let underline = Quill.import('formats/underline.js');
  //  let blockquote = Quill.import('formats/blockquote.js');
  }


  componentDidMount(props) {

    if(this.props.content) {
      this.setState({content: this.props.content});
    }

    quill = new Quill('#editor', {
      theme: 'snow',
      formats: ['bold', 'italic', 'color', 'image','underline','blockquote','strike','list','code','header','link'],
      modules: {
        toolbar: {
           container: [['bold', 'italic', 'underline', 'blockquote','strike','code',{header: 1},{header: 2}],
           [{ 'list': 'ordered' }, { 'list': 'bullet' }],
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

    if (source == 'api') {
    } else if (source == 'user') {
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
