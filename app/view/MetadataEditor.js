Ext.define('Uploader.view.MetadataEditor', {
    extend: 'Ext.form.Panel',
    alias: 'widget.metadataeditor',
    
    title: 'Metadata Browser',
    split: true,
    useArrows: true,
    itemId: 'editor',
    defaults : {
    	xtype: 'textfield',
    	columnWidth: 0.5,
    	labelStyle: 'padding-left:10px;',
    	labelWidth: '150',
    	padding: 5
    },
    //layout: 'column',
    autoScroll: true,
    //bodyPadding: 10,
 	frame: true,
    items: {
        itemId: 'metadatagrid',
        xtype: 'gridpanel',
        columns: [],
        hidden: false
    },
    
    initComponent: function() {
    	var me = this;

    	me.dockedItems = [{
    		xtype: 'toolbar',
    		docked: 'top',
    		items: [{
                xtype: 'filefield',
                emptyText: 'Select a CSV file',
                fieldLabel: 'Metadata',
                listeners: {
                    'change': function(fb, v) {
                        console.log(v);
                        var file = fb.getEl().down('input[type=file]').dom.files[0]; 
                        console.log(file);
                        var reader = new FileReader();
                        reader.onload = function(event){
                            console.log(typeof(event.target.result));
                            var json = me.csv2json(event.target.result);
                            console.log(json.header);
                            var columns= json.header.map(function (field) {
                                return {
                                    text: Ext.String.capitalize(field),
                                    width: 100,
                                    dataIndex: field
                                };
                            }); 
                            var new_store = Ext.create('Ext.data.Store', {
                                fields: json.header,
                                data: json.data
                            });
                            me.getComponent("metadatagrid").reconfigure(new_store, columns);
                        };
                        reader.onerror = function(){
                            console.log('Error reading the file');
                        };
                        reader.readAsText(file);
                    }
                }
            }]
            /*items : [{
    			xtype: 'box',
    			hidden: true,
    			itemId: 'downloadLink',
    			autoEl: {
        			tag: 'a',
        			href: 'http://www.google.it',
        			html: 'http://www.google.it'
    			}}, 
    			'->',
    			{text: 'Save Metadata', iconCls: 'save-icon16', action: 'save'}
    		] */
    	}];
        
    	me.callParent();
    },

    buildItems: function(fields, record) {
    	var me = this;
    	me.removeAll();
    	console.log("building fields at runtime");
    	//console.log(fields);
    	var form = [];
    	for (var i = 0; i < fields.length; i++) {
    		var fname = fields[i].name;
    		if (fname != 'CategoryIDs' && fname != 'TypeID' && fname != 'Keywords2' && (fname.indexOf('/') != 0)) {
    			var f = {name: fname, fieldLabel: fname};
    			if (fields[i].type) {
    				f.xtype = 'numberfield';
    			}
    			if (fname == 'FileName') {
    				f.value = record.filename;
    				f.readOnly = true;
    			} else if (fname == 'Size') {
    				f.value = record.size;
    				f.readOnly = true;
    			} else if (fname == 'LastModificationDate' || fname == 'SubmissionDate') {
    				f.xtype = 'datefield';
    				f.value = new Date();
    				f.format = 'd/m/Y H:m';
    				f.submitFormat = 'Y-m-d H:m';
    			}
    			me.add(f);
    		}
    		
    		//form.push(f);
    	}
    	console.log(form);
    	//me.items = form;
    },

    csv2json: function(rawdata) {
        console.log("JSON conversion");
        var data = rawdata.toString().split("\n");

        var header = data[0];
        var attributes = header.trim().split(';');
        for (var i in attributes) {
            attributes[i] = attributes[i].toLowerCase().replace(/ /g, "_");
        }
        var newdata = [];

        for (var i = 1; i < data.length; i++) {
            var values = data[i].split(";");
            var record = {};
            for (var j=0; j < attributes.length; j++) {
                record[attributes[j]] = values[j];  
            }
            newdata.push(record);
        }
        //console.log(newdata);
        return {
            header: attributes,
            data: newdata
        }
    }
});