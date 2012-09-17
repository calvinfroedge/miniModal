$(document).ready(function(){
	(function($) {
		var instances = [];

		$.miniModal = function(instance){
			if(!instance) {
				return new Modal();
			}
			else {
				if(!instances[instance]) {
					instances[instance] = new Modal();
				}
             
				return instances[instance];
			}
		};


		function Modal(){

			this.url = false;

			this.callbacks = {};

			this.hooks = {};

			var that = this;
			
			//Public methods
			return {
				
				constructor: Modal,

				launch: function(data, callbacks, type){

					if(that.hooks.beforeLaunch) that.doHooks(that.hooks.beforeLaunch);

					that.callbacks = callbacks;

					if(typeof type == "undefined") type = "get";

					if(type == "get"){
						that.url = data;
						that.getData(that, "load");
					}
					else if(type == "content"){
						that.load(that, data);
					}

					if(that.hooks.afterLaunch) that.doHooks(that.hooks.afterLaunch);
				},

				refresh: function()
				{
					if(that.hooks.beforeRefresh) that.doHooks(that.hooks.beforeRefresh);

					that.getData(that, "reload");

					if(that.hooks.afterRefresh) that.doHooks(that.hooks.afterRefresh);
				},

				addHook: function(hook, action){
					if(!that.hooks[hook]) that.hooks[hook] = [];

					that.hooks[hook].push(action);
				},

				getHooks: function(hook){
					return that.hooks[hook];
				}
			}
		}

		//Private methods
		Modal.prototype.getData = function(that, modalCallback)
		{
			if(!that.url) return false;

			if(that.hooks.beforeGetData) that.doHooks(that.hooks.beforeGetData);

			$.ajax(
				{
					url: that.url,
					success: function(data){
						if(modalCallback == 'load')
						{
							that.load(that, data);		
						}
						else 
						{
							that.reload(that, data);
						}
						that.doCallbacks(that);
					}
				}
			);

			if(that.hooks.afterGetData) that.doHooks(that.hooks.afterGetData);
		}

		Modal.prototype.doCallbacks = function(that)
		{
			if(that.hooks.beforeCallbacks) that.doHooks(that.hooks.beforeCallbacks);

			$.each(that.callbacks, function(k, v){
				that.callbacks[k]();
			});

			if(that.hooks.beforeCallbacks) that.doHooks(that.hooks.afterCallbacks);
		}

		Modal.prototype.doHooks = function(hooks)
		{
			$.each(hooks, function(k, v){
				hooks[k]();
			});
		}

		Modal.prototype.load = function(that, data)
		{
			if(that.hooks.beforeLoad) that.doHooks(that.hooks.beforeLoad);

			that.overlay = $('<div id="overlay"></div>');
			that.modal = $('<div id="mini_modal"></div>');
			that.closer = $('<a href="#" class="close">Close</a>');
			$(that.closer).appendTo($(that.modal));
			$(that.overlay).prependTo($('body'));

			$(that.overlay).click(function(){
				that.close(that);
			});

			$(that.closer).click(function(){
				that.close(that);
			});

			$(that.modal).prependTo($('body'));
			$('<div class="container"><div class="content">'+data+'</div></div>').appendTo($(that.modal));
			setTimeout(function(){ that.center($(that.modal));}, '100');

			if(that.hooks.beforeLoad) that.doHooks(that.hooks.afterLoad);
		}

		Modal.prototype.reload = function (that, data)
		{
			if(that.hooks.beforeReload) that.doHooks(that.hooks.beforeReload);

			$('#mini_modal .content').children().remove();
			$(data).appendTo('#mini_modal .content');

			if(that.hooks.beforeReload) that.doHooks(that.hooks.beforeReload);
		}

		Modal.prototype.close = function(that)
		{
			if(that.hooks.beforeClose) that.doHooks(that.hooks.beforeClose);

			var time = '300';
			$(that.overlay).fadeOut(time);
			$(that.modal).fadeOut(time);
			setTimeout(
				function(){
					$(that.overlay).remove();
					$(that.modal).remove();
					
					if(that.hooks.afterClose) that.doHooks(that.hooks.afterClose);
				},
				time
			);
		}

		Modal.prototype.center = function (modal)
		{
			modal.css("position","absolute");
			modal.css("top", Math.max(0, (($(window).height() - modal.outerHeight()) / 2)) + "px");
			modal.css("left", Math.max(0, (($(window).width() - modal.outerWidth()) / 2) + $(window).scrollLeft()) + "px");
		}
	})( jQuery );
});
