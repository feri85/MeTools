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

    This process mounted one or more items, rendered an member object(s) to an predefined HTML markup item on a page.
    
        eg.
        
          <div>
            <p id='message'>Have you just a minute or a second or....</p>
            <h1 id='nothing'>'so it nothing'</h1>
            <input type='button' name='push' value='hit'/>
          </div>
   
       Usage: Emule('message','nothing','push');
       
       And all component will set on window 'layer'.
       
       Now do some supplement to the member propertyes:
       
          a, change HTML item attributes:
             nothing.id='checked';
             ...
             nothing.modify();
             
              or
             
             nothing.member.id='checked';
             
           b, delete items: so its some way to do, this 
           
            -delete all: remove all of content from a selected member, and from the refered element on the page.
            
              let:  cast of an <form> component.
              
              eg.   cast.remove('all');
              
            -delete only: removes an HTML item rereferenced member object only. (unmount).
            
              eg. cast.remove('only');
              
            -delete the current block: removes all of the selected element child object and their references, it delete the container element too.
            
              eg. cast.remove();  /default/
              
              
           c, shielding an element or an group in a block:
           
              this method hide, or restore member elements and childnodes on a page.
           
              eg. ingredients _> <ul>
              
                ingredients('hide') disapeared;
                
                ingredients('restore') all 'shielded' items appended on a page.
                
            
            
    ................
