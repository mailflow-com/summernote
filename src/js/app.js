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
    height: 300,                  // set editable area's height
    focus: true,                  // set focus editable area after summernote loaded
    tabsize: 2,                   // size of tab
    placeholder: 'Type your message here...', // set editable area's placeholder text
    codemirror: {                 // code mirror options
      mode: 'text/html',
      htmlMode: true,
      lineNumbers: true,
      theme: 'monokai'
    }
  });
});
 
