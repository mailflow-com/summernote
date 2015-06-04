require.config({
  baseUrl: 'src/js',
  paths: {
    jquery: '//code.jquery.com/jquery-1.9.1.min',
    jqueryUi: '//code.jquery.com/ui/1.10.4/jquery-ui.min',
    bootstrap: '//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min',
    summernotevideo: '/../../plugin/summernote-ext-video',
    CodeMirror: '//cdnjs.cloudflare.com/ajax/libs/codemirror/3.20.0/codemirror',
    CodeMirrorXml: '//cdnjs.cloudflare.com/ajax/libs/codemirror/3.20.0/mode/xml/xml.min',
    CodeMirrorFormatting: '//cdnjs.cloudflare.com/ajax/libs/codemirror/2.36.0/formatting.min',
    iframeTransport: '/../../plugin/jquery.iframe-transport',
    fileupload: '/../../plugin/jquery.fileupload'
  },
  shim: {
    bootstrap: ['jquery'],
    CodeMirror: { exports: 'CodeMirror' },
    CodeMirrorXml: ['CodeMirror'],
    CodeMirrorFormatting: ['CodeMirror', 'CodeMirrorXml'],
    summernotevideo: ['summernote']
  },
  packages: [{
    name: 'summernote',
    location: './',
    main: 'summernote'
  }]
});

require([
  'jquery', 'jqueryUi', 'bootstrap', 'CodeMirrorFormatting',
  'summernote', 'summernotevideo', 'iframeTransport', 'fileupload'
], function ($) {
  // summernote
  $('.summernote').summernote({
    s3: true,
    s3TokenUrl: 'http://localhost:3001/internal/images',
    s3BucketUrl: 'https://mailflow-image-uploads.s3.amazonaws.com',
    s3FetchExisting: function(){return new Promise(function (resolve, reject) {
      resolve({data:{images:[
      {url:'https://s3.amazonaws.com/mailflow-image-uploads/4f4c7009-1b08-4593-90b8-6a0e80d20444/pear2.jpg'},
      {url: 'http://images5.fanpop.com/image/photos/30800000/-Random-random-30843841-1920-1080.jpg'},
      {url: 'http://www.shockmansion.com/wp-content/myimages/2013/02/Posted-On-Shock-Mansion-5327.jpg'},
      {url: 'http://i.telegraph.co.uk/multimedia/archive/01838/lottery_1838360b.jpg'},
      {url: 'http://www.mathsisfun.com/data/images/random-variable-1.gif'}
      ]}});
    });},
    height: 500,                  // set editable area's height
    focus: true,                  // set focus editable area after summernote loaded
    tabsize: 2,                   // size of tab
    placeholder: 'Type your message here...', // set editable area's placeholder text
    codemirrorOnly: true,
    codemirror: {                 // code mirror options
      mode: 'text/html',
      htmlMode: true,
      lineNumbers: true,
      theme: 'monokai'
    }
  });
});
 
