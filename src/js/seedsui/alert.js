//Alert 提示框
(function(window,document,undefined){
	
	window.Alert=function(msg,params){
		/*================
		Model
		================*/
		var defaults={
			overflowContainer:document.body,
			parent:document.body,
			maskClass:"mask",
			alertClass:"alert",
			contentClass:"alert-content",
			handlerClass:"alert-handler",
			title:"提示",
			buttonOk:"确定",
			buttonCancel:"取消",
			content:msg,
			isClickMaskHide:false
			/*
            Callbacks:
            onClick:function(Alert)
			onClickOk:function(Alert)
			onClickCancel:function(Alert)
			onClickMask:function(Alert)
			*/
		}
		params=params||{};
		for(var def in defaults){
			if(params[def]==undefined){
				params[def]=defaults[def];
			}
		}
		var s=this;
		s.params=params;
		//Parent | OverflowContainer
		s.parent=typeof s.params.parent=="string"?document.querySelector(s.params.parent):s.params.parent;
		s.overflowContainer=typeof s.params.overflowContainer=="string"?document.querySelector(s.params.overflowContainer):s.params.overflowContainer;
		//Alert | Mask
		s.container,s.mask;
		//Mask
		s.createMask=function(){
            var mask=document.createElement("div");
            mask.setAttribute("class",s.params.maskClass);
            return mask;
        }
        //Alert
        s.createButtonCancel=function(){
        	var buttonCancel=document.createElement("a");
			buttonCancel.innerHTML=s.params.buttonCancel;
			return buttonCancel;
        }
		s.createAlert=function(){
			var alert=document.createElement("div");
			alert.setAttribute("class",s.params.alertClass);

			alert.content=document.createElement("div");
			alert.content.setAttribute("class",s.params.contentClass);
			alert.content.innerHTML=s.params.content;

			alert.handler=document.createElement("div");
			alert.handler.setAttribute("class",s.params.handlerClass);

			//如果有取消按钮
			if(s.params.onClickCancel){
				alert.buttonCancel=s.createButtonCancel();
				alert.handler.appendChild(alert.buttonCancel);
			}
			alert.buttonOk=document.createElement("a");
			alert.buttonOk.innerHTML=s.params.buttonOk;

			alert.handler.appendChild(alert.buttonOk);
			
			if(s.params.title){
				alert.caption=document.createElement("h1");
				alert.caption.innerHTML=s.params.title;
				alert.appendChild(alert.caption);
			}

			alert.appendChild(alert.content);
			alert.appendChild(alert.handler);

			return alert;
		}
		s.create=function(){
			s.mask=s.createMask();
			s.container=s.createAlert();
			s.parent.appendChild(s.mask);
			s.parent.appendChild(s.container);
		}
		s.create();
		/*================
		Method
		================*/
		s.showMask=function(){
            s.mask.classList.add("active");
        }
        s.hideMask=function(){
        	s.mask.classList.remove("active");
        }
        s.destroyMask=function(){
        	s.parent.removeChild(s.mask);
        }
        s.showAlert=function(){
        	s.container.classList.add("active");
        }
        s.hideAlert=function(){
        	s.container.classList.remove("active");
        }
        s.destroyAlert=function(){
        	s.parent.removeChild(s.container);
        }
		s.isHid=true;
		s.hide=function(){
			s.isHid=true;
			//显示遮罩
			s.hideMask();
			//显示弹出框
			s.hideAlert();
			//显示滚动条
			if(s.overflowContainer)
            s.overflowContainer.style.overflow="auto";
		};
		s.show=function(){
			s.isHid=false;
			//显示遮罩
			s.showMask();
			//显示弹出框
			s.showAlert();
			//禁用滚动条
			if(s.overflowContainer)
            s.overflowContainer.style.overflow="hidden";
		};
		s.destroy=function(){
			//移动事件监听
			s.detach();
			//移除遮罩
			s.destroyMask();
			//移除弹出框
			s.destroyAlert();
		};
		//动态设置
		s.setText=function(msg){
			s.container.content.innerHTML=msg;
		};
		s.setOnClick=function(fn){
        	s.params.onClick=fn;
        }
		s.setOnClickOk=function(fn){
        	s.params.onClickOk=fn;
        }
        s.setOnClickCancel=function(fn){
        	//如果没有取消按钮，创建一个
        	if(!s.params.onClickCancel){
				s.container.buttonCancel=s.createButtonCancel();
				s.container.handler.insertBefore(s.container.buttonCancel,s.container.buttonOk);
			}
        	s.params.onClickCancel=fn;
        }
		/*================
		Control
		================*/
        s.events=function(detach){
            var touchTarget=s.container;
            var action=detach?"removeEventListener":"addEventListener";
            touchTarget[action]("click",s.onClick,false);
            touchTarget[action]("webkitTransitionEnd",s.onTransitionEnd,false);
            //遮罩
            s.mask[action]("click",s.onClickMask,false);
        }
        //attach、dettach事件
        s.attach=function(event){
            s.events();
        }
        s.detach=function(event){
            s.events(true);
        }
		s.onClick=function(e){
			s.target=e.target;
			
			if(s.params.onClick)s.params.onClick(s);
			
			if(e.target==s.container.buttonOk){
				if(s.params.onClickOk)s.params.onClickOk(s);
				else s.hide();
			}else if(s.container.buttonCancel && e.target==s.container.buttonCancel){
				if(s.params.onClickCancel)s.params.onClickCancel(s);
				else s.hide();
			}
		}
		s.setOnClick=function(fn){
            s.params.onClick=fn;
        }
		s.onClickMask=function(e){
			s.target=e.target;
			if(s.params.onClickMask)s.params.onClickMask(s);
			if(s.params.isClickMaskHide)s.hide();
		}
		s.setOnClickMask=function(fn){
            s.params.onClickMask=fn;
        }
		s.onTransitionEnd=function(e){
			if(e.propertyName=="visibility")return;
		}
		/*================
		Init
		================*/
		s.init=function(){
			s.attach();
		}
		s.init();
	}
})(window,document,undefined);