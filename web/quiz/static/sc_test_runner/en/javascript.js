
Object.extend(String.English,{});TestRunner=SC.Object.create({server:SC.Server.create({prefix:['TestRunner']}),FIXTURES:[],controllers:[]});require('core');TestRunner.Test=SC.Record.extend({title:function(){if(!this._title){var parts=(this.get('name')||'').split('/');var ret=parts.pop()||'';this._title=ret.replace(/\.rhtml$/,'').replace(/_/g,' ');}
return this._title;}.property('name'),group:function(){if(!this._group){var parts=(this.get('name')||'').split('/');this._group=parts.slice(0,parts.length-1).join('/').toLowerCase();}
return this._group;}.property('name')});function main(){SC.page.awake();console.log('main');var indexRoot=window.location.pathname.toString().replace(/-tests\/.*/,'-tests').substr(1,window.location.pathname.length);var clientName=indexRoot.match(/([^\/]+)\/-tests/)[1];var urlRoot=indexRoot.replace(new RegExp("^%@/?".fmt(window.indexPrefix)),window.urlPrefix+'/');console.log('indexRoot: %@ clientName: %@ urlRoot: %@'.fmt(indexRoot,clientName,urlRoot));TestRunner.runnerController.set('selection',[]);TestRunner.runnerController.set('urlRoot',urlRoot);TestRunner.runnerController.set('indexRoot',indexRoot);TestRunner.runnerController.set('clientName',clientName);TestRunner.runnerController.reloadTests();};require('core');TestRunner.TEST_NONE='none';TestRunner.TEST_LOADING='loading';TestRunner.TEST_RUNNING='running';TestRunner.TEST_PASSED='passed';TestRunner.TEST_FAILED='failed';TestRunner.RunnerFrameView=SC.View.extend({test:null,state:TestRunner.TEST_NONE,testObserver:function(){var test=this.get('test');var url=(test)?test.get('url'):'';var doc=(this.rootElement.contentWindow)?this.rootElement.contentWindow.document:this.rootElement.document;if(doc)doc.testExpired=YES;if(url==this.rootElement.src){this.rootElement.src='javascript:;';this.rootElement.src=url;}else{this.rootElement.src=url;}
this.set('state',TestRunner.TEST_LOADING);this.checkState();}.observes('test'),checkState:function(){var doc=(this.rootElement.contentWindow)?this.rootElement.contentWindow.document:this.rootElement.document;var queuedTests=(doc)?doc.queuedTests:null;var testStatus=(doc)?doc.testStatus:null;var status=TestRunner.TEST_NONE;var reschedule=true;if(!doc||(queuedTests==null)||doc.testExpired){status=(this.get('test'))?TestRunner.TEST_LOADING:TestRunner.TEST_NONE;}else if(queuedTests==0){status=(testStatus!='SUCCESS')?TestRunner.TEST_FAILED:TestRunner.TEST_PASSED;reschedule=false;}else{status=((testStatus!='FAILED')&&(testStatus!='ERROR'))?TestRunner.TEST_RUNNING:TestRunner.TEST_FAILED;if(status==TestRunner.TEST_FAILED)reschedule=false;}
if(this.get('state')!=status)this.set('state',status);if(reschedule)this.invokeLater(this.checkState,100);}});require('core');TestRunner.runnerController=SC.Object.create({windowLocation:window.location.href,clientName:'',displayClientName:function(){var clientName=(this.get('clientName')||'').humanize().capitalize();if(clientName=='Sproutcore')clientName='SproutCore';return"%@ Tests".fmt(clientName);}.property('clientName'),arrangedObjects:[],selection:[],selectedTest:function(){var sel=this.get('selection');return(sel&&sel.length>0)?sel[0]:null;}.property('selection'),testState:null,testStateLabel:function(){switch(this.get('testState')){case TestRunner.TEST_LOADING:return'Loading Test...';case TestRunner.TEST_RUNNING:return'Test Running...';case TestRunner.TEST_PASSED:return'Passed!';case TestRunner.TEST_FAILED:return'Failed.';default:return'';}}.property('testState'),testStateIsRunning:function(){return(this.get('testState')===TestRunner.TEST_RUNNING);}.property('testState'),isRunning:NO,isContinuousIntegrationEnabled:NO,runTestLabel:function(){return(this.get('isRunning'))?"Stop All Tests":"Run All Tests";}.property('isRunning'),toggleRunTests:function(){this.toggleProperty('isRunning');},rerunCurrentTest:function(){var test=this.get('selectedTest');if(test){this.set('selection',[]);this.set('selection',[test]);}},canRerunCurrentTest:function(){if(this.get('isRunning'))return NO;var state=this.get('testState');var ret=(state===TestRunner.TEST_FAILED||state===TestRunner.TEST_PASSED)?YES:NO;return ret;}.property('isRunning','testState'),reloadTests:function(){var urlRoot=this.get('urlRoot');TestRunner.server.request(urlRoot,'index.js',null,{nonce:Date.now().toString(),onSuccess:this._reloadSuccess.bind(this),onFailure:this._reloadFailure.bind(this)});},_reloadSuccess:function(status,transport){var json=transport.responseText;var records=eval(json);console.log('JSON: %@'.fmt(json));if($type(records)!=T_ARRAY){return this._reloadFailure(status,transport);}
var recs=SC.Store.updateRecords(records,this,TestRunner.Test,true);console.log('retrieved records: %@'.fmt(recs.join(',')));if(recs.length==0){SC.page.get('noTestsPanel').set('isVisible',true);this.invokeLater(this.reloadTests,2000);}else{SC.page.get('noTestsPanel').set('isVisible',false);}
recs=recs.sort(function(a,b){var a_g=a.get('group')||'';var b_g=b.get('group')||'';var ret=a_g.localeCompare(b_g);return(ret!=0)?ret:(a.get('title')||'').localeCompare(b.get('title')||'');});var hadArrangedObjects=this.get('arrangedObjects').length>0;this.set('arrangedObjects',recs);var test=this.get('selectedTest');if(test&&!(recs.include(test)))this.set('selection',[]);if(!hadArrangedObjects||(this.get('isRunning')&&(this.get('isContinuousIntegrationEnabled')))){if(recs.length>0)this.set('selection',[recs.first()]);}},_reloadFailure:function(status,transport){console.log('TEST RELOAD FAILED!');},isRunningObserver:function(){if(this.didChangeFor('isRunningObserver','isRunning')){if(this.get('isRunning')){var tests=this.get('arrangedObjects');var firstTest=(tests&&tests.length>0)?[tests[0]]:[];this.set('selection',[]);var t=function(){this.set('selection',firstTest);}.invokeLater(this,1);}}}.observes('isRunning'),testStateObserver:function(){if(!this.didChangeFor('testStateObserver','testState'))return;if(!this.get('isRunning'))return;var testState=this.get('testState');if(testState==TestRunner.TEST_PASSED){var tests=this.get('arrangedObjects')||[];var test=this.get('selectedTest')||tests.first();var idx=tests.indexOf(test);if(idx<0)idx=0;idx++;if(idx>=tests.length){if(this.get('isContinuousIntegrationEnabled')){this.reloadTests();}else{this.set('isRunning',false);}
return;}
test=tests[idx];if(!test)test=tests[0];this.set('selection',(test)?[test]:[]);}else if(testState==TestRunner.TEST_FAILED){this.set('isRunning',false);if(this.get('isContinuousIntegrationEnabled')==YES){alert('Unit Test Failed!');}}}.observes('testState')});require('core');TestRunner.TestLabelView=SC.ButtonView.extend({emptyElement:'<a href="javascript:;"><span></span></a>',contentObserver:function(){var c=this.get('content');this.set('labelText',(c)?c.get('title'):'(NONE)');}.observes('content'),labelSelector:'span',mouseDown:function(){return false;}});