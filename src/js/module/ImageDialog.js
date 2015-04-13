define(function () {
  var ImageDialog = function (handler) {
    /**
     * toggle button status
     *
     * @private
     * @param {jQuery} $btn
     * @param {Boolean} isEnable
     */
    var toggleBtn = function ($btn, isEnable) {
      $btn.toggleClass('disabled', !isEnable);
      $btn.attr('disabled', !isEnable);
    };

    this.show = function (layoutInfo) {
      var $dialog = layoutInfo.dialog(),
          $editor = layoutInfo.editor(),
          $editable = layoutInfo.editable();

      handler.invoke('editor.saveRange', $editable);
      this.showImageDialog($editable, $dialog, $editor).then(function (data) {
        handler.invoke('editor.restoreRange', $editable);

        if (typeof data === 'string') {
          // image url
          handler.invoke('editor.insertImage', $editable, data);
        } else {
          // array of files
          handler.insertImages(layoutInfo, data);
        }
      }).fail(function () {
        handler.invoke('editor.restoreRange', $editable);
      });
    };

    /**
     * show image dialog
     *
     * @param {jQuery} $editable
     * @param {jQuery} $dialog
     * @return {Promise}
     */
    this.showImageDialog = function ($editable, $dialog, $editor) {
      var options = $editor.data('options');
      return $.Deferred(function (deferred) {
        var $imageDialog = $dialog.find('.note-image-dialog');

        var $imageInput = $dialog.find('.note-image-input'),
            $imageUrl = $dialog.find('.note-image-url'),
            $imageBtn = $dialog.find('.note-image-btn');
        
        $imageUrl.val('');

        if (options.s3) {
          $imageDialog.one('shown.bs.modal', function () {
            // Cloning imageInput to clear element.
            $imageInput.replaceWith($imageInput.clone()
              .on('change', function () {
                deferred.resolve(this.files || this.value);
                $imageDialog.modal('hide');
              })
              .val('')
            );

            $('#SummernoteS3Form').fileupload({
              forceIframeTransport: true,
              autoUpload: true,
              add: function (event, data) {
                $.ajax({
                  url: options.s3TokenUrl,
                  type: 'POST',
                  dataType: 'json',
                  data: {doc: {title: data.files[0].name, size: data.files[0].size, type: data.files[0].type}},
                  async: false,
                  success: function(retdata) {
                    // after we created our document in rails, it is going to send back JSON of they key,
                    // policy, and signature.  We will put these into our form before it gets submitted to amazon.
                    $('#SummernoteS3Form').find('input[name=key]').val(retdata.key);
                    $('#SummernoteS3Form').find('input[name=policy]').val(retdata.policy);
                    $('#SummernoteS3Form').find('input[name=signature]').val(retdata.signature);
                    $('#SummernoteS3Form').find('input[name=AWSAccessKeyId]').val(retdata.AWSAccessKeyId);
                  }
                });

                data.submit();
              },
              send: function(e, data) {
                // show a loading spinner because now the form will be submitted to amazon, 
                // and the file will be directly uploaded there, via an iframe in the background. 
                $('#SummernoteS3Loading').show();
              },
              fail: function(e, data) {
                console.log('fail');
                console.log(data);
              },
              done: function (event, data) {
                $('#SummernoteS3Loading').hide();
                var url = data.url + data.formData[0].value;
                toggleBtn($imageBtn, url);
                return $imageUrl.val(url);
              },
            });

            $imageBtn.click(function (event) {
              event.preventDefault();

              deferred.resolve($imageUrl.val());
              $imageDialog.modal('hide');
            });

          }).one('hidden.bs.modal', function () {
            $imageBtn.off('click');

            if (deferred.state() === 'pending') {
              deferred.reject();
            }
          }).modal('show');
        } else {        
          $imageDialog.one('shown.bs.modal', function () {
            // Cloning imageInput to clear element.
            $imageInput.replaceWith($imageInput.clone()
              .on('change', function () {
                deferred.resolve(this.files || this.value);
                $imageDialog.modal('hide');
              })
              .val('')
            );

            $imageBtn.click(function (event) {
              event.preventDefault();

              deferred.resolve($imageUrl.val());
              $imageDialog.modal('hide');
            });

            $imageUrl.on('keyup paste', function (event) {
              var url;
              
              if (event.type === 'paste') {
                url = event.originalEvent.clipboardData.getData('text');
              } else {
                url = $imageUrl.val();
              }
              
              toggleBtn($imageBtn, url);
            }).val('').trigger('focus');
          }).one('hidden.bs.modal', function () {
            $imageInput.off('change');
            $imageUrl.off('keyup paste');
            $imageBtn.off('click');

            if (deferred.state() === 'pending') {
              deferred.reject();
            }
          }).modal('show');
        }
      });
    };
  };

  return ImageDialog;
});
