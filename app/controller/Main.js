Ext.define('Uploader.controller.Main', {
	extend: 'Ext.app.Controller',

	init: function() {
		var me = this;

		me.control({
			'grid': {
				itemdblclick: me.fileSelected
			},
			'metadataeditor toolbar button': {
				click: me.saveMetadata
			}
		});

		console.log('Main Controller loaded');
		
	},

	fileSelected: function(grid,record,item,index,event,ops) {
		var me = this;
		console.log('hai selezionato un file');

		console.log(record.data);
		console.log(record.data.filename);

		var metadatagrid = Ext.ComponentQuery.query('gridpanel')[1];
		var metadataStore = metadatagrid.getStore();
		console.log(metadataStore);
		if (metadataStore) {
			var idx = metadataStore.find('nome_file', record.data.filename);
			console.log(idx);
			if (idx != -1) {
				metadatagrid.getView().focusRow(idx);
				metadatagrid.getSelectionModel().select(idx);
			} else {
				Ext.MessageBox.alert('Warning', 'Cannot find metadata associated with this file');
			}
			

		}

		/*var downloadLink = Ext.ComponentQuery.query('#downloadLink')[0];
		var vo = 'vo.indicate-project.eu';
		var se = 'infn-se-03.ct.pi2s2.it';
		var path = '/dpm/ct.pi2s2.it/home/vo.indicate-project.eu/glibrary/';
		var link = 'http://glibrary.ct.infn.it/dm/' + vo + '/' + se + '/' + path  
			+ record.data.filename.replace(/ /g, "_"); 
		downloadLink.update('<a href="' + link + '">' + link + '</a>');
		downloadLink.show();

		var typestree = Ext.ComponentQuery.query('typestree')[0];
		var selectedType = typestree.getSelectionModel().getSelection() [0];

		if (!selectedType || selectedType.data.depth == 0) {
			Ext.Msg.alert("Error","Please select a type first!");
		} else {
			console.log(selectedType.data);
			me.loadMetadata(selectedType.data.path, record.data);
		} */
	},

	loadMetadata: function(typepath, record) {

		Ext.Ajax.request({
			url: 'http://glibrary.ct.infn.it/django/metadata' + typepath + '/',
			method: 'GET',
			success: function(response) {
				var data = Ext.decode( response.responseText );
				console.log(data.metadata);
				var editor = Ext.ComponentQuery.query('#editor')[0];
				//console.log(editor);
				editor.buildItems(data.metadata.fields, record);
			},
			failure: function(response) {
				Ext.Msg.alert("Error","Cannot retrieve the metadata for the selected type. Look at the error log");
				console.log("error");
				console.log(response);
			}
		});
	},

	saveMetadata: function() {
		console.log("save metadata")
		var typestree = Ext.ComponentQuery.query('typestree')[0];
		var selectedType = typestree.getSelectionModel().getSelection()[0];
		if (!selectedType || selectedType.data.depth == 0) {
			Ext.Msg.alert("Error","Please select a type first!");
			return;
		}
		var form = Ext.ComponentQuery.query('metadataeditor')[0].getForm()
		var metadata = form.getValues(false, true);
		var fname = form.getValues().FileName.replace(/ /g, "_");
		metadata.FileName = fname;
		metadata.Size = form.getValues().Size;
		metadata.Replica = "https://infn-se-03.ct.pi2s2.it/dpm/ct.pi2s2.it/home/vo.indicate-project.eu/glibrary/" + fname;
		console.log(metadata);
		Ext.Ajax.request({
			url: 'http://glibrary.ct.infn.it/django/saveMetadata' + selectedType.data.path + '/',
			params: metadata,
			success: function(response) {
				Ext.ComponentQuery.query('metadataeditor')[0].removeAll();
				Ext.Msg.alert("Success!", "Metadata added successfully");
			},
			failure: function(response) {
				Ext.Msg.alert("Error","Cannot save metadata to the server. Look at the error log");
				console.log("error");
				console.log(response);
			}
		}); 
	}
});