  var count = 0;
    var id=1;
    var stamp;
    $(function() {
        loadNotes();
    });
    
    function bindActions(note) {
        note.draggable({
            cancel: '.not-draggable',
            handle: '.note-draggable',
            distance: 10
        });
        
        note.resizable({
            minWidth: 70,
            maxWidth: 500, 
            minHeight: 70, 
            maxHeight: 500,
            resize: function(event, ui) {
                var body = $(this).children('.note-body');
                body.height(ui.size.height - 32);
            }
        });
        
        note.children('.note-body').on('keyup paste' ,function() {
            (function(title, content){
                stamp = new Date().getTime();
                setTimeout(function(){
                    if (new Date().getTime() - stamp > 995) {
                        saveNote(title, content);
                    }
                }, 1000); 
            })(note.find('.note-title').text(), $(this).html());
        });

        note.find('.note-title').dblclick(function() {
            var title = window.prompt('请输入新标题, 最多10个字符', $(this).text());
            if (title) {
                $(this).text(title.substr(0, 10));
            }
        });

        note.find('.note-add').click(function() {
            createNote();
        });

        note.find('.note-fold').click(function() {
            var body = note.children('.note-body');
            body.slideToggle();
            $(this).text($(this).text() == '折叠' ? '展开' : '折叠');
        });
        
        note.find('.note-delete').click(function() {
            var sure = window.confirm('确定删除吗?');
            if (sure) {
                note.remove();
                deleteNote(note.find('.note-title').text());
                count --;
            }
        });
    }
    
    function createNote(title, content) {
        var note = $('<div class="note">');
        var head = $('<div class="note-head note-draggable orange">');
        var body = $('<div contenteditable="true" class="note-body">').html(content || '');
        head.append($('<span class="note-title" title="双击修改标题">').text(title || '便笺' + id));
        head.append($('<span class="note-add not-draggable">').text('新建'));
        head.append($('<span class="note-fold not-draggable">').text('折叠'));
        head.append($('<span class="note-delete not-draggable">').text('关闭'));
        note.append(head).append(body);
        bindActions(note);
        note.appendTo($('body')).show();
        
        count ++;
        id++;
        
        return note;
    }
    
    function saveNote(title, content) {
        localStorage[title] = content;
    }
    
    function deleteNote(title) {
        delete localStorage[title];
    }
    
    function loadNotes() {
        if (0 == localStorage.length) {
            createNote();
        }
        else {
            for (title in localStorage){
                createNote(title, localStorage[title]);
            }     
        }
    }
