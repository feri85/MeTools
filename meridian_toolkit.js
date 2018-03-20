var Me=function(){
	Me.n=0;
	Me.rootlv_handle=null;
	this.err=false;
	window.usePerformed=false;
	Me.bw=function(){
		if(document.all){
			return true;
		}
		else{
			return false;
		}
	};
	
	var getsys=function(){
		if(Me.bw()==false){
			return Array.prototype.slice.call(document.getElementsByTagName('*'));
		}
		else{
			var src=document.getElementsByTagName('*');
			var nodes=[];
			for(var i=0; i<src.length; i++){
				nodes.push(src[i]);
			}
			return nodes;
		};
	};
	var jump_rootlevels=function(root,pragma){
		if(root instanceof Object){
			for(var n in root){
				if(root[n] instanceof Object && root[n]!=null){
					jump_rootlevels(root[n],pragma);
				}
				if(pragma instanceof Object){
					pragma.keysOf=n;					//report of object levels
				}
				if(Me.rootlv_handle instanceof Function){
					Me.rootlv_handle.apply(this,arguments);
				}
			}
			pragma.track=root;
		}
		return(root);
	};
	var errlog=function(bool,obj,index){
		try{
			if(bool){
				throw new Error(obj[index])
			}
		}
		catch(e){
			var err=e.message;
			throw new Error(err)
		}
	};
	this.erorrs=errlog;
	this.rootlevels=jump_rootlevels;
	this.sys=getsys;
};

Me.prototype.principials={
	/*uniques:['id','name','class','style','src','alt','type','href','data','cite','autoplay','accept','async','align','selected','action','method','multiple','muted','rel','required','media','hidden','formaction',
	'autocomplete','autosave','color','code','codebase','defer','border','controls','checked','enctype','dirname','disabled','draggable','lang','for','form','formaction','headers','coords','content','cols','rows',
	'bgcolor','buffered','preload','step','summary','size','lang','sizes','span','shape','scope','scoped','title','target','loop','ismap','manifest','keytype','kind','readonly'],  not used in this case*/
	set_nodeprop:function(member,name,value){
		this.member=member;
		this.name=name;
		this.value=value;
		var memberattr=document.createAttribute(this.name);
		memberattr.value=this.value;
		this.member.attributes.setNamedItem(memberattr);
	},
	shd_backup:{},
	shd_apply:function(member,mode){
		this.member=member;
		var propvalue=this.member.attributes.component.value;
		if(mode && mode=='hide' && this.shd_backup instanceof Object){
			if(this.member.parentNode){
				this.shd_backup[propvalue]=this.member.parentNode;
				this.shd_backup[propvalue].removeChild(this.member);
			}			
		}
		if(mode && mode=='restore' && this.shd_backup[propvalue]){
			this.shd_backup[propvalue].appendChild(this.member);
		}
	},
	node_setprops:function(member,memberobj){
		this.member=member;
		this.memberobj=memberobj;
		for(var p in memberobj){
			if(typeof memberobj[p]=='string'){
				var prop=null;
				if(!Me.bw()){
					if(p=='text'){
						if(this.member.tagName=='INPUT'){
							prop='value';
						}
						else{
							this.member.textContent=memberobj[p];
						}
					}
					else if(p=='content'){
						this.member.innerHTML=memberobj[p];
					}
					else{
						prop=p;
					}
				}
				else{
					if(p=='text'){
						if(this.member.tagName=='INPUT'){
							prop='value';
						}
						else{
							this.member.innerHTML=memberobj[p];
						}
					}
					else if(p=='content'){
						this.member.innerHTML=memberobj[p];
					}
					else{
						prop=p;
					}
				}
				if(prop){
					Me.prototype.principials.set_nodeprop(this.member,prop,memberobj[p]);
				}
			}
		}
	},
	apply_delete:function(uint,type,obj){
		function trydelete(x){
			if(window[x] || window[x] instanceof Object){
				window[x] = undefined;
				try{
					delete window[x];
				}catch(e){
					
				};
			};
		};
		if(uint && typeof type=='string'){
			if(type=='all' && uint.firstChild){											//deletes the all content of an member.
				do{
					uint.removeChild(uint.firstChild);
				}while(uint.firstChild);	
			};
			if(type=='only'){															//deletes an member reference only. (member unmounted)
				trydelete(obj);
			};
		}
		else if(uint && typeof type=='undefined'){
			do{
				if(uint.childNodes.length>0){
					uint.removeChild(uint.firstChild);
				}
			}while(uint.firstChild);
			uint.parentNode.removeChild(uint);
			trydelete(obj);
		};
	},
	external_node:function(uint,name){
		this.uint=uint;
		this.name=name;
		window[name]=null;
		var that=this;
		if(!window[this.name]){
			window[this.name]=new Object();
			window[this.name].member=this.uint;
			window[this.name].component=this.name;
			window[this.name].modify=function(){
				Me.prototype.principials.node_setprops(that.uint,window[that.name]);
			}
			Me.prototype.principials.set_nodeprop(this.uint,'component',this.name);
			window[this.name].remove=function(options){
				Me.prototype.principials.apply_delete(that.uint,options,that.name);
			}
			window[this.name].shielded=function(q){
				Me.prototype.principials.shd_apply(that.uint,q);
			}
		}
	},
	group_nodes:function(uint,name){
		if(uint instanceof Array){
			this.uint=uint;
			this.name=name;
			var that=this;
			window[this.name]=[];
			for(var i=0; i<this.uint.length; i++){
				window[this.name].push(this.uint[i]);
			}
			window[this.name].parent=this.uint[0].parentNode;
		}
	}
}
	
Me.prototype.Tool=function(){
	Me.apply(this);
	var err=false;
	var that=this;
	var rootlevels=this.rootlevels;
	var utility=Me.prototype.principials;
	var bw=Me.bw;
	var errlog=this.erorrs;
	var attr=null;
	var define_error={
		1:'The elemet uniquename not instance of Object!',
		2:'Name separator has miss, or invalid! use (>)',
		3:'1 of arguments wrong typed!',
		4:'Missing arguments',
		5:'Parameter incorrect!',
		6:'Except Filename!',
		7:'Not found an object!'
	};
	this.Q=function(valuename,group){
		var b=0;
		var requested=[];
		var typednodes=[];
		var tags=valuename.match(/<(.*)>/);
		if(document.readyState=='complete'){
			if(tags==null || tags.length<1){
				for(var n=0; n<that.sys().length; n++){
					attr=that.sys()[n].attributes;
					if(attr!=null && attr.length>0){
						for(var c=0;c<attr.length;c++){
							if(attr[c].name=='class' && attr[c].value==valuename){
								requested.push(attr=that.sys()[n]);	
								err=false;
							}
						}
						for(var a=0;a<attr.length;a++){	
							if(attr[a].name!='class' && attr[a].value==valuename){
								requested=that.sys()[n];
								err=false;
							};
						};
					};
				};
			};
			if(tags){
				var node=tags[1];
				for(var o=0; o<that.sys().length; o++){
					if(that.sys()[o].tagName==node.toUpperCase()){
						requested.push(that.sys()[o]);
						err=false;
					}
					/*else{
						err=true;
					};*/
				};
			};
			
			if(group){ 
			//get the group of elements with an spcified attributevalue;
			//modes:1 /g  returns of array with requested elements;
				requested=[];
				for(var p=0; p<that.sys().length; p++){
					var prop=that.sys()[p].attributes;
					for(var u=0; u<prop.length; u++){
					if(prop!=null && prop.length>0){
						if(prop[u].value==valuename){
							if(group=='/g'){
								requested.push(that.sys()[p]);
							}
							err=false;
							}
						}
					}
				};
			}
		}
		if(document.body==null){
			if(tags){
				var node=tags[1];
				for(var n in that.sys()[1].childNodes){
					if(parseInt(n)){
						if(that.sys()[1].childNodes[parseInt(n)].tagName==node.toUpperCase()){
							requested.push(that.sys()[1].childNodes[parseInt(n)]);
							err=false;
						}
						/*else{
							err=true;
						}*/
					}	
				}
			}
		}
		
		if(requested==null || requested.length==0){
			err=true;
		};
		if(!err){
			return requested;
		}
		else{
			errlog();
		};
	};
	this.C=function(obj,placement){
		var craftall=[];
		var draft=arguments[0];
		var craftnode=null;
		var props=null;
		var noerr=null;
		Me.rootlv_handle=function(){
			var key=arguments[1].keysOf;
			var current=arguments[1].track;
			var wrapper=arguments[0][key];
			var verify=key.match(/_[0-9]{1,}/g);
			var cracked=key.replace(/_[0-9]{1,}/g,'');
			if(key.indexOf('_')>-1){
				craftnode=document.createElement(cracked);
				wrapper['sections']=craftnode;
				props=document.createAttribute(key);
				
				if(typeof current!='undefined'){
					for(var p in current){	
						if(p.indexOf('_')<0 && p!='sections' && p!='text' &&p!='component'){
							new utility.set_nodeprop(craftnode,p,current[p])
						}
						else if(p=='text'){
							if(!bw()){
								if(craftnode.tagName=='INPUT'){
									craftnode.value=current[p];
								}
								else{
									craftnode.textContent=current[p];
								}
							}
							else{
								if(craftnode.tagName=='INPUT'){
									craftnode.value=current[p];
								}
								else{
									craftnode.innerHTML=current[p];
								}
							}
						}
						else if(p=='content'){
							craftnode.innerHTML=current[p];
						}
						else if(p=='component'){
							new utility.external_node(craftnode,current[p]);
						}
					}
				}
				for(var c in wrapper){
					if(typeof wrapper[c].sections!='undefined'){
						wrapper.sections.appendChild(wrapper[c].sections);
					}
				}
			}
		};
		if(!placement){
			placement=document.body;
		}
		else if(placement=='head'){
			placement=that.sys()[1];//document.getElementsByTagName('HEAD')[0];
		}
		else{
			if(!that.Q(placement)instanceof Array){
				placement=that.Q(placement);
			}
		}
		craftall=rootlevels(obj,{});
		for(var key in craftall){
			placement.appendChild(craftall[key].sections);
		}
	};
	that.P=function(){
		var order=arguments;
		var eq=that.Q;
		var matches=null;
		for(var p=0; p<order.length; p++){
			if(order[p] && typeof order[p]=='string'){
				var cracked=order[p].match(/(.*?)>*(\w|[0-9]|[^\x00-\x7F]+){1,}/g);
				for(var n=0; n<cracked.length; n++){
					cracked[n]=cracked[n].replace('>','');
					var first=(eq(cracked[0]))? eq(cracked[0]) : window[''+cracked[0]].member;
					//var uintlist=[];
					try{
						if(eq(cracked[n]) instanceof Array){
							if(!bw()){
								var uints=Array.prototype.slice.call(eq(cracked[n]));
								for(var c=0; c<eq(cracked[n]).length; c++){
									first.appendChild(uints[c]);
								}
								
							}
							else{
								var tracks=eq(cracked[n]);
								for(var i=0; i<eq(cracked[n]).length; i++){
									first.appendChild(tracks[i])
								}	
							}	
						}
						else{
							if(n>0){
								if(window[''+cracked[n]].member){
									first.appendChild(window[''+cracked[n]].member)
								}
								else{
									first.appendChild(eq(cracked[n]));
								}
							}
						}
					}
					catch(e){
						throw new Error('The elemet uniquename not instance of Object!'+':::::'+e)
					};
				};
			};
		};
	};
	this.C.setM=function(namedtype,attributes){
		/*String.prototype.splice = function(idx, rem, str) {
			return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
		};*/
		var breakup=(namedtype.match(/(.*?)>*[a-z]{1,}/g));
		for(var i=0; i<breakup.length; i++){
			breakup[i]=breakup[i].replace('>','');
		}
		var err=true;
		var errindex=null;
		if(!namedtype){
			errindex=4;
			err=true;
		}else{
			if(typeof namedtype!='string'){
				err=true;
				errindex=3;	
			}
			else{
				if(namedtype.indexOf('>')<0){
					err=true;
					errindex=2;
				}
				else{
					if(breakup.length>2){
						err=true;
						errindex=5;
					}else{
						err=false;
					}
				}
			}
		}
		if(!err){
			breakup[breakup.length-1]+="_0";
			var node=breakup[breakup.length-1];
			var M=new Object();
				M[node]={};
				M[node].component=breakup[0];
			this(M);
			if(attributes && attributes instanceof Object){
				for(var props in attributes){
					if(props!='text'){
						window[breakup[0]][props]=attributes[props];
					}
					if(props=='content'){
						window[breakup[0]].innerHTML=attributes[props];
					}
					else{
						window[breakup[0]].innerHTML=attributes[props];
					}	
				}
			}
		}
		else{
			errlog(err,define_error,errindex);
		}
	};
	this.L=function(srctype,handler,proplist){
		var craftmodell=that.C;
		var err=true;
		var errcode=null;
		var D=new Object();
		var eq=that.Q;
		var bw=Me.bw;
		function eqobj(tagname){
			var target=null;
			if(eq(tagname)){	
				for(var q=0; q<eq(tagname).length;q++){
					if(eq(tagname)[q].parentNode.tagName=='HEAD'){	
						target=eq(tagname)[q];
						
					}
				}
			}
			
			return target;
		};
		function initializename(rebound){
			rebound=rebound.replace('./','');
			var point_chr=rebound.indexOf('.');
			var sep_chr=(rebound.lastIndexOf('/')>-1)? rebound.lastIndexOf('/')+1 : 0;
			return rebound.slice(sep_chr,point_chr);
		}
		
		if(!srctype){
			err=true;
			errcode=4;
		}
		else if(srctype.indexOf('.esx')<0 && srctype.indexOf('.css')<0){
				err=true;
				errcode=6;
		}else{err=false}
		
		if(!err){
			if(!window[initializename(srctype)]){
				if(srctype.indexOf('.esx')>-1){
					D['script_0']={};
					D['script_0'].type='text/javascript';
					D['script_0'].component=initializename(srctype);
					craftmodell(D,'head');//(D)
					var platform=window[initializename(srctype)].member;
					that.sys()[1].insertBefore(platform,eqobj('<script>').nextSibling);
					//that.sys()[1].insertBefore(platform,eqobj('<script>').previousSibling);
					platform.src=srctype;
					if(handler && !proplist && typeof handler=='string'){
						if(!bw()){
							platform.onload=function(){
								window[handler]();							
							};
						}
						else{
							window[handler]();
						};
					};
					if(handler && proplist && typeof handler=='string' && proplist instanceof Array){
						if(!bw()){
							platform.onload=function(){
								
								window[handler].apply(this,proplist);	
							};
						}
						else{
							window[handler].apply(this,proplist);
						};
					};
				}
				else{
					D['link_0']={};
					D['link_0'].rel='stylesheet';
					D['link_0'].type='text/css';
					D['link_0'].component=initializename(srctype);
					craftmodell(D,'head');
					var style=window[initializename(srctype)].member;
					style.href=srctype;
				};
			}
		}
		else{
			errlog(err,define_error,errcode);
		};
	};
	this.E=function(){
		var eq=that.Q;
		var getarg=arguments;
		for(var th=0; th<arguments.length; th++){
			var mounter=eq(arguments[th]);
			if(!mounter.length){
				new utility.external_node(mounter,arguments[th]);	
			}
			else{
				new utility.group_nodes(mounter,arguments[th]);
				for(var p=0;p<mounter.length;p++){
					new utility.external_node(mounter[p],arguments[th]+(p+1));
				};
			};
		};
	};
	this.E.getGroup=function(group){
		if(group instanceof Array){
			for(var c=0;c<group.length; c++){
				var result=group[c];
			}
			return result;
		}
		else{
			return null;
		}
	}
}

Me.prototype.Initialize={
	accessMeridian:window['nsMeridian']=new Me.prototype.Tool,
	accessQ:window['Use']=nsMeridian.Q,							//this tool sets for use an DOM object with has any attributes;
	accessC:window['Craft']=nsMeridian.C,						//Create new members;
	accessMemberSet:window['setMember']=nsMeridian.C.setM,		//Set an member in body element.
	accessP:window['Pattern']=nsMeridian.P,						//Set hiearchy options, modify elements 'position' in DOM levels;
	accessL:window['loadModul']=nsMeridian.L,					//Loads an external ecmascript module;
	accessE:window['Emule']=nsMeridian.E,						//Emule mebers from a document element
	accessGroup:window['getGroup']=nsMeridian.E.getGroup,
}


//Copyright:	(c) GPL3 protected license.
//Author:    	 Ferenc Szabó  szaboferenc008@gmail.com.

//This utility was inspirated by Macromedia (Adobe) Director environment, but it's an different object based 'miniclip'.

