$(document).ready(function(){
	(function($) {
		$.miniModal = function(){
			return new Modal();
		};

		function Modal(){

			this.url = false;

			this.callbacks = {};

			var that = this;
			
			//Public methods
			return {
				
				constructor: Modal,

				launch: function(getUrl, callbacks){
					that.callbacks = callbacks;
					that.url = getUrl;

					that.getData(that, "load");
				},

				refresh: function()
				{
					that.getData(that, "reload");
				}
			}
		}

		//Private methods
		Modal.prototype.getData = function(that, modalCallback)
		{
			if(!that.url) return false;

			$.ajax(
				{
					url: that.url,
					success: function(data){
						if(modalCallback == 'load'){
							that.load(that, data);		
						}
						else {
							that.reload(that, data);
						}

						that.doCallbacks(that);
					}
				}
			);
		}

		Modal.prototype.doCallbacks = function(that)
		{
			$.each(that.callbacks, function(k, v){
				that.callbacks[k]();
			});
		}

		Modal.prototype.load = function(that, data)
		{
			that.overlay = $('<div id="overlay"></div>');
			that.modal = $('<div id="mini_modal"></div>');
			that.closer = $('<a href="#" class="close">Close</a>');
			$(that.closer).appendTo($(that.modal));
			$(that.overlay).prependTo($('body'));

			$(that.overlay).click(function(){
				that.close(that);
			});

			$(that.closer).click(function(){
				that.close();
			});

			$(that.modal).prependTo($('body')).center();
			$('<div class="content">'+data+'</div>').appendTo($(that.modal));
		}

		Modal.prototype.reload = function (that, data)
		{
		}

		Modal.prototype.close = function(that)
		{
			var time = '300';
			$(that.overlay).fadeOut(time);
			$(that.modal).fadeOut(time);
			setTimeout(
				function(){
					$(that.overlay).remove();
					$(that.modal).remove();
				},
				time
			);
		}

	})( jQuery );
});
