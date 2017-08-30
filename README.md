# MeTools
-Meridian toolkit for all-, short version of nsMeridian.
An javascript source from the greather one, this code is a short version of nsMeridian, and now it works, with all major browsers.
Warning: some of the original commands are dropped or modify in this application.
Notice:NsMeridian maybe deprecated in the future, and changes to MeTools / Meridian-toolkit.

Guide:

1. MeToolkit not needed to declare, this process is automaticaly when, set up the script tag in HTML page head block (optimal it      first).

2.The Use tool:
  use an DOM element on a page with has any 'attributename';

     Use('container');

   let: container is the element id attributevalue.

    -to modify: 
     Use('container').name[alt,id,src, .... etc]='value';
     
3.The Craft tool:

  Craft elements as object declaration.
  
  Phase 1 create group of item gap.
  
  let: T is the container of the object tree.
       We have opportunity for define complex hiearchy like the HTML structures.
       In this case the object name has to imply it of the HTML element tagname, seperate with an _ sign.
       If the member poperty has set, the 'marked' element added to window object as a component, referenced
       with its membername.
       
       Tese hiearchy has the opponent of the html construction
  
    var T={
      div_1:{
        id:'firstbox',
        text:'this is the first div element',
        member:'chat',
        style:'position:absolute;width:300px;height:200px;border: 1px solid black;',
        input_0:{
          type:'button',
          name:'detect',
          value:'click on',
        },
        div_0:{
          id:'theme',
          p_0:{
          }
        }
      },
      h2_0:{
        id:'title',
      },
      p_0:{
        id:'textguide',
      }
    }
    
    or
         var D=new Object();
          D['script_0']={};
    
    Usage: 
    
        Craft((T|D),[placement]);
   
     
    Phase 2 create an single item (component).
        
      Note! Member has  automaticaly set on the window 'layer'.
        
        setMember('article>div',{
                  id:'issues',
                  text:'Other dialogs',
        });
      
      The first parameter consist of two component. First is the component name, the second seperated with > to set the HTML tag.The second parameter is an object like the abowe example.
      All of these parameter are obligatory to turn up.
      
     Phase 3 other way to apply the object sintax.
     
         let: var Smart=new Object(); is the block;
         
         eg.
          
          Smart['Form_0']={};
          Smart['Form_0'].name='thisform';
          Smart['Form_0'].method='POST';
          
          Craft(Smart,'myelement');
          
4. Element Emule tool:
    
    ................
