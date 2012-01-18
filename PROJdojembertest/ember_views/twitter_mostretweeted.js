function VizifyApp_CreateView_MostRetweeted()
{
	 window.VizifyApp.emberView_TwitterMostRetweeted =
		  Ember.View.create({
										templateName: 'EMBTPLtweetcoll',
										name: "emberView_TwitterMostRetweeted",
										contentBinding: "VizifyApp.emberColl_TwitterMostRetweeted.content"
								  });
	 window.VizifyApp.emberView_TwitterMostRetweeted.append();
}
