
	$(".profiling_ques_date").datepicker({ format: 'dd-mm-yyyy' });
	$("#bookAppointmentModal input[name='date']").datepicker({ format: 'yyyy-mm-dd' });

	$(document).on('click','.hamburger', function() {
        $("aside").toggleClass("toggle-display");
    })

	function submitLater(){
		var result = confirm("Really want to submit without answers?");
		if (result) {
		    $("#profilingForm").submit();
			return true;
		}
	}

	$(document).on("change", ".new-radio-btn input[type='radio']", function () {
		var main_parent = $(this).parent().parent().parent();
		$(".new-radio-btn", main_parent).removeClass("checked");
		$(this).parent().parent()[this.checked ? "addClass" : "removeClass"]("checked");
	});

	$(document).ready(function () {

		// action taken over checkbox button click
		$(document).on('click','.question_option_value', function(){
		//$('.question_option_value').click(function() {

			var qbox_content = $(this).closest('[answered="no"]');
			
			// calculate first element/question location
			var firstQuestionPosition = $('body #profilingForm').offset().top;
			// calculate current question position
			var currentQuestionPosition = $(qbox_content).offset().top;
			
			// return success if everything goes OK
			$(qbox_content).removeClass('qbox-default qbox-error qbox-success');
			$(qbox_content).addClass('qbox-success');

			var check_type = $(this).attr('type');
			
			if(check_type == "radio")
			{
				// scroll to next question
				$('html, body').animate({
					// scrollTop: $(qbox_content).closest('.question-box').next('.question-box').offset().top - firstQuestionPosition
					scrollTop: $(qbox_content).next('.question-box').offset().top - 100
				}, 500);
			}
		});
		
	});
	
	function Validate(_this) {
		try {
			// variable to validate form
			var validate = true;

			// calculate first element/question location
			var firstQuestionPosition = $('body #profilingForm').offset().top;

			// fetch each question from from and validate it
			$('#profilingForm [answered="no"] .options').each(function(question) {
				
				var type = $(this).attr("data-type");

				// check if any option is selected for this question
				if(type == "radio" || type == "multiple"){
					total_length = 1;
				}
				else{
					total_length = $(this).find('.question_option_value').length;
				}

				// check if any option is selected for this question
				if ($(this).find('.question_option_value:checked').length !== total_length) {
					var check_type = $(this).find('.question_option_value:checked').attr("type");
					
					if(check_type == "checkbox" && $(this).find('.question_option_value:checked').length !== 0)
					{
						// set as validated fields
						$(this).closest('[answered="no"]').removeClass('qbox-default qbox-error qbox-success').addClass('qbox-success');
					}
					else
					{
						// set validate as false 
						// means form is not validated
						validate = false;

						// highlight this question as error and scroll to this question
						// return success if everything goes OK
						$(this).closest('[answered="no"]').removeClass('qbox-default qbox-error qbox-success').addClass('qbox-error');

						// scroll to next question
						$('html, body').animate({
							scrollTop: $(this).closest('.question-box').next('.question-box').offset().top - (firstQuestionPosition * 2.5)
						}, 500);
					}
				} else {
					// set as validated fields
					$(this).closest('[answered="no"]').removeClass('qbox-default qbox-error qbox-success').addClass('qbox-success');
				}
				
			});

			// if form successfully validated
			if (validate) {
				
				var id = _this.id;
				if(id == "_exist"){

					$(_this).prop( "disabled", true );

					var channel_id = $("#channel_id").val();
					let myForm = document.getElementById('profilingForm');
					let formData = new FormData(myForm);
					$("#loader", _this).css("display", "inline-block");

	            	$.ajax({
				        url: "/student-profiler/save-profiling-answers.php?channel_id="+channel_id,
				        type: 'POST',
				        data: formData,
				        success: function (data) {
				        	window.location.reload();
				        },
				        cache: false,
				        contentType: false,
				        processData: false
				    });

				}
				else{
					var modal_type = $(_this).attr("data-modal-type");
					$("#"+modal_type).modal({backdrop: 'static', keyboard: false});
				}

				return true;
			}

			return false;
		} catch (err) {
			console.log('Error in Validate: ', err.message);
		}
	}
	
	function validateContent(v){

		var content = v.value;
		var id = v.id;
		var res = id.split("area");

		var type = v.type;
		if(type == "email"){
			var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
			if(!content.match(validRegex)){
				$(v).closest('[answered="no"]').removeClass('qbox-default qbox-error qbox-success').addClass('qbox-error');
				$('#rBtn'+res[1]).prop('checked',false);
				return false;
			}
		}

		var mandatory = $('#rBtn'+res[1]).attr("data-mandatory");
		
		if(content != "")
		{
			$(v).closest('[answered="no"]').removeClass('qbox-default qbox-error qbox-success').addClass('qbox-success');
			$('#rBtn'+res[1]).prop('checked',true);
		}
		else if(mandatory == "1" && content == "")
		{
			$(v).closest('[answered="no"]').removeClass('qbox-default qbox-error qbox-success').addClass('qbox-error');
			$('#rBtn'+res[1]).prop('checked',false);
		}
		else{
			$(v).closest('[answered="no"]').removeClass('qbox-default qbox-error qbox-success').addClass('qbox-success');
			$('#rBtn'+res[1]).prop('checked',true);
		}
	}

	//Ajax Calls
	$(".opt").click(function(){
		
		var level = $(this).attr("data-level");
		$(this).addClass('selected');
		$(this).html('<i class="fa-solid fa-circle-check"></i>');
		$(".hidden-loader").css("display", "flex");
		var channel_id = $("#channel_id").val();

		$.ajax({
	        url: "/student-profiler/get-profiling-questions.php?channel_id="+channel_id,
	        type: 'POST',
	        data: {level: level},
	        success: function (data) {
	            $(".main-section .row .col-md-12").html(data);
				$(".profiling_ques_date").datepicker({ format: 'dd-mm-yyyy' });
	        }
	    });

	})

	$(".sign-up").click(function(e){
	
		$("#sign-up-modal .form_error").html("");	

		e.preventDefault();
		let myForm = document.getElementById('sign-up-form');
		let formData = new FormData(myForm);

		$(".sign-up #loader").css("display", "inline-block");
		$(".sign-up").prop("disabled", true);
		var channel_id = $("#channel_id").val();
		var subcrm_id = $("#subcrm_id").val();

	    $.ajax({
	        url: "/student-profiler/sign-up.php?channel_id="+channel_id+"&subcrm_id="+subcrm_id,
	        type: 'POST',
	        data: formData,
	        success: function (data) {
	            const obj = JSON.parse(data);
	            if(obj.type == "success"){
	            	
	            	let myForm = document.getElementById('profilingForm');
					let formData = new FormData(myForm);

	            	$.ajax({
				        url: "/student-profiler/save-profiling-answers.php?channel_id="+channel_id,
				        type: 'POST',
				        data: formData,
				        success: function (data) {
				        	window.location.reload();
				        },
				        cache: false,
				        contentType: false,
				        processData: false
				    });

	            }
	            else{
	            	$("#sign-up-modal .form_error").html(obj.message);	            	
	            }
	            $(".sign-up").prop("disabled", false);
	            $(".sign-up #loader").css("display", "none");
	        },
	        cache: false,
	        contentType: false,
	        processData: false
	    });

	});

	$(".sign-in").click(function(e){
	
		$("#sign-in-modal .form_error").html("");	

		e.preventDefault();
		let myForm = document.getElementById('sign-in-form');
		let formData = new FormData(myForm);

		$(".sign-in #loader").css("display", "inline-block");
		$(".sign-in").prop("disabled", true);
		var channel_id = $("#channel_id").val();

	    $.ajax({
	        url: "/student-profiler/sign-in.php?channel_id="+channel_id,
	        type: 'POST',
	        data: formData,
	        success: function (data) {
				console.log(data);
	            const obj = JSON.parse(data);
	            if(obj.type == "success"){
	            	window.location.reload();
	            }
	            else{
	            	$("#sign-in-modal .form_error").html(obj.message);	            	
	            }
	            $(".sign-in").prop("disabled", false);
	            $(".sign-in #loader").css("display", "none");
	        },
	        cache: false,
	        contentType: false,
	        processData: false
	    });

	});

	// $(".sidenav li span.heading, .next-btn").click(function(){
	$(document).on('click','.sidenav li span.heading, .next-btn', function() {
		var action = $(this).attr("data-action");
		var channel_id = $("#channel_id").val();
		var subcrm_id = $("#subcrm_id").val();

		if(action == "profiling"){
			if(subcrm_id != "")
				window.location.href = '/student-profiler/?channel_id='+channel_id+"&subcrm_id="+subcrm_id;
			else
				window.location.href = '/student-profiler/?channel_id='+channel_id;
		}
		else if(action == "english-test"){
			window.open("/abroad-studies/open-assessment/");
		}
		else if(action == "sop-maker"){
			window.open("/sop-maker/sop-1");
		}
		else if(action == "career-assessment"){
			window.open("/student-dashboard/suitability-registration/login/"+channel_id+"/as12-as13-as204-as14");
		}
		else{
			$.ajax({
	            url: "/student-profiler/do-action.php?channel_id="+channel_id,
	            type: 'POST',
	            data: {action: action},
	            success: function (data) {
	            	$(".main-section .row .col-md-12").html(data);
					$(".profiling_ques_date").datepicker({ format: 'dd-mm-yyyy' });
					if ($(window).width() < 600)
						$("aside").toggleClass("toggle-display");
					$('html,body').animate({scrollTop: $(".main-section").offset().top - 100}, 'slow');
	            }
	        });
		}
	})

	function upload(u){
		var data = u.id;
		var res = data.split("_");
		
		let myForm = document.getElementById("uploadForm"+res[1]);
		let formData = new FormData(myForm);

		var channel_id = $("#channel_id").val();

		$("#uploadForm"+res[1]).html('<img src="/student-profiler/loader.svg" style="max-width: 25px;margin-left: 10px;display: inline-block;">');

		$.ajax({
	        url: "/student-profiler/upload-documents.php?channel_id="+channel_id,
	        type: 'POST',
	        data: formData,
	        success: function (data) {
	            const obj = JSON.parse(data);
	            if(obj.type == "success"){
	            	show_updated_documents();
	            }
	            else{
	            	alert(obj.message);
	            }
	        },
	        cache: false,
	        contentType: false,
	        processData: false
	    });

	}

	function reupload(ru){
		var data = ru.id;
		var res = data.split("_");
		
		let myForm = document.getElementById("ReUploadForm"+res[1]);
		let formData = new FormData(myForm);

		var channel_id = $("#channel_id").val();

		$("#ReUploadForm"+res[1]).html('<img src="/student-profiler/loader.svg" style="max-width: 25px;margin-left: 10px;display: inline-block;">');

		$.ajax({
	        url: "/student-profiler/upload-documents.php?channel_id="+channel_id,
	        type: 'POST',
	        data: formData,
	        success: function (data) {
	            const obj = JSON.parse(data);
	            if(obj.type == "success"){
	            	show_updated_documents();
	            }
	            else{
	            	alert(obj.message);
	            }
	        },
	        cache: false,
	        contentType: false,
	        processData: false
	    });

	}

	function deleteFile(d){

		if (confirm("Really want to Delete?") == true) {
			var data = d.id;
			var res = data.split("_");
			
			let myForm = document.getElementById("DeleteForm"+res[1]);
			let formData = new FormData(myForm);

			var channel_id = $("#channel_id").val();

			$("#DeleteForm"+res[1]).html('<img src="/student-profiler/loader.svg" style="max-width: 25px;margin-left: 10px;display: inline-block;">');

			$.ajax({
		        url: "/student-profiler/upload-documents.php?channel_id="+channel_id,
		        type: 'POST',
		        data: formData,
		        success: function (data) {
		            const obj = JSON.parse(data);
		            if(obj.type == "success"){
		            	show_updated_documents();
		            }
		            else{
		            	alert(obj.message);
		            }
		        },
		        cache: false,
		        contentType: false,
		        processData: false
		    });
		}

	}

	function show_updated_documents(){
		var channel_id = $("#channel_id").val();
		var show_doc_type = $("#show_doc_type").val();
		$.ajax({
            url: "/student-profiler/do-action.php?channel_id="+channel_id,
            type: 'POST',
            data: {action: show_doc_type},
            success: function (data) {
            	$(".main-section .row .col-md-12").html(data);
            }
        });
	}

	//$(".show-status-details").click(function(e){
	$(document).on('click','.show-status-details', function() {

		var id = $(this).attr("data-id");

	    $.ajax({
	        url: "/abroad-studies/show-status-details.php",
	        type: 'POST',
	        data: {id: id},
	        success: function (data) {
	            $("#status-modal .data").html(data);
	            $("#status-modal").modal("show");
	        }
	    });

	});

	//$(".show-comment-details").click(function(e){
	$(document).on('click','.show-comment-details', function() {

		var id = $(this).attr("data-id");

	    $.ajax({
	        url: "/abroad-studies/show-comment-details.php",
	        type: 'POST',
	        data: {id: id},
	        success: function (data) {
	            $("#status-modal .data").html(data);
	            $("#status-modal").modal("show");
	        }
	    });

	});

	//$(".university-specific-task").click(function () {
	$(document).on('click','.university-specific-task', function() {
		
		$("#icon").css("display", "none");
		$("#div-cross-icon").css("display", "flex");
		$(".chat-screen").css("display", "block");

		var data_search = $(this).attr("data-search");

		$.ajax({
			url: "/abroad-studies/get-communication.php",
			type: 'POST',
			data: {action: "show-chat", search: data_search},
			success: function (data) {
				$(".chat-screen .chat-body").html(data);
				$('.chat-screen .chat-body').scrollTop($('.chat-screen .chat-body')[0].scrollHeight);
			}
		});

	});

	$(document).on('click','.uploadOthDoc', function() {

		const oth_doc = document.getElementById('un_oth_doc')
		if(oth_doc.files[0].size > 5000000){
			alert("File size is too large. File size cannot be more than 5 MB. Please Reupload");
			return false;
		}
		
		let myForm = document.getElementById("otherDocForm");
		let formData = new FormData(myForm);

		var channel_id = $("#channel_id").val();

		$(".uploadOthDoc").prop( "disabled", true );
		$(".uploadOthDoc #loader").css("display", "inline-block");

		$.ajax({
	        url: "/student-profiler/upload-documents.php?channel_id="+channel_id,
	        type: 'POST',
	        data: formData,
	        success: function (data) {
	            const obj = JSON.parse(data);
	            if(obj.type == "success"){
	            	$("#uploadOtherDocuments").modal("hide");
	            	show_updated_documents();
	            }
	            else{
	            	alert(obj.message);
	            }
	            $(".uploadOthDoc").prop( "disabled", false );
				$(".uploadOthDoc #loader").css("display", "none");
	        },
	        cache: false,
	        contentType: false,
	        processData: false
	    });

	})

	//New Signup Form
	$(".request-otp").click(function(e){
	
		$("#new-sign-up-modal .form_error").html("");	

		e.preventDefault();
		let myForm = document.getElementById('new-sign-up-form');
		let formData = new FormData(myForm);

		$(".request-otp #loader").css("display", "inline-block");
		$(".request-otp").prop("disabled", true);
		var channel_id = $("#channel_id").val();
		var subcrm_id = $("#subcrm_id").val();

	    $.ajax({
	        url: "/student-profiler/request-otp.php?channel_id="+channel_id+"&subcrm_id="+subcrm_id,
	        type: 'POST',
	        data: formData,
	        success: function (data) {
	            const obj = JSON.parse(data);
	            if(obj.type == "success"){
					$("#proceed-to-otp").hide();
					$("#verify-to-otp").show();
					$("#tempOTPShow").text(obj.otp);
	            }
	            else{
	            	$("#new-sign-up-modal .form_error").html(obj.message);	            	
	            }
	            $(".request-otp").prop("disabled", false);
	            $(".request-otp #loader").css("display", "none");
	        },
	        cache: false,
	        contentType: false,
	        processData: false
	    });

	});

	$(".validate-otp").click(function(e){
	
		$("#new-sign-up-modal .form_error").html("");	

		e.preventDefault();
		let myForm = document.getElementById('new-sign-up-form');
		let formData = new FormData(myForm);

		$(".validate-otp #loader").css("display", "inline-block");
		$(".validate-otp").prop("disabled", true);
		var channel_id = $("#channel_id").val();
		var subcrm_id = $("#subcrm_id").val();

	    $.ajax({
	        url: "/student-profiler/validate-otp.php?channel_id="+channel_id+"&subcrm_id="+subcrm_id,
	        type: 'POST',
	        data: formData,
	        success: function (data) {
	            const obj = JSON.parse(data);
	            if(obj.type == "success"){
	            	
					$("#new-sign-up-modal").modal('hide');
	            	let myForm = document.getElementById('profilingForm');
					let formData = new FormData(myForm);

	            	$.ajax({
				        url: "/student-profiler/save-profiling-answers.php?channel_id="+channel_id,
				        type: 'POST',
				        data: formData,
				        success: function (data) {
				        	// window.location.reload();
							
							// $.ajax({
							// 	url: "/student-profiler/do-action.php?channel_id="+channel_id,
							// 	type: 'POST',
							// 	data: {action: "colleges"},
							// 	success: function (data) {
							// 		$(".main-section .row .col-md-12").html(data);
							// 		$(".profiling_ques_date").datepicker({ format: 'dd-mm-yyyy' });
							// 		if ($(window).width() < 600)
							// 			$("aside").toggleClass("toggle-display");
							// 		$('html,body').animate({scrollTop: $(".main-section").offset().top - 100}, 'slow');
							// 	}
							// });

							window.location.href = window.location.href+"&colleges";
				        },
				        cache: false,
				        contentType: false,
				        processData: false
				    });

	            }
	            else{
	            	$("#new-sign-up-modal .form_error").html(obj.message);	            	
	            }
	            $(".validate-otp").prop("disabled", false);
	            $(".validate-otp #loader").css("display", "none");
	        },
	        cache: false,
	        contentType: false,
	        processData: false
	    });

	});

	//
	$('.verify-otp-boxes').find('input').each(function() {
		$(this).attr('maxlength', 1);
		$(this).on('keyup', function(e) {
			var parent = $($(this).parent());
			
			if(e.keyCode === 8 || e.keyCode === 37) {
				var prev = parent.find('input#' + $(this).data('previous'));
				
				if(prev.length) {
					$(prev).select();
				}
			} else if((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode === 39) {
				var next = parent.find('input#' + $(this).data('next'));
				
				if(next.length) {
					$(next).select();
				} else {
					if(parent.data('autosubmit')) {
						parent.submit();
					}
				}
			}
		});
	});

	$(document).on("click", "#bookAppointmentModal ul li", function () {
		$("#bookAppointmentModal ul li").removeClass("active");
		$(this).addClass("active");
		var time = $(this).text();
		$("#bookAppointmentModal input[name='time']").val(time);
	});

	$(".bookAppointment").click(function(e){
	
		$("#bookAppointmentModal .form_error").html("");	

		e.preventDefault();
		let myForm = document.getElementById('bookAppointment');
		let formData = new FormData(myForm);

		$(".bookAppointment #loader").css("display", "inline-block");
		$(".bookAppointment").prop("disabled", true);
		var channel_id = $("#channel_id").val();
		var subcrm_id = $("#subcrm_id").val();

	    $.ajax({
	        url: "/student-profiler/bookAppointment.php?channel_id="+channel_id+"&subcrm_id="+subcrm_id,
	        type: 'POST',
	        data: formData,
	        success: function (data) {
	            const obj = JSON.parse(data);
	            if(obj.type == "success"){
	            	$("#bookAppointmentModal h4").hide();
	            	$("#bookAppointmentModal form").html("<p style='margin: 0;text-align: center;font-size: 18px;color: #1e3f9a !important;line-height: 1.5;'>"+obj.message+"</p>");
	            }
	            else{
	            	$("#bookAppointmentModal .form_error").html(obj.message);	            	
	            }
	            $(".bookAppointment").prop("disabled", false);
	            $(".bookAppointment #loader").css("display", "none");
	        },
	        cache: false,
	        contentType: false,
	        processData: false
	    });

	});

	$(document).on("click", ".upload-other-doc", function () {
		var doc_type = $(this).attr("data-title");
		$("#doc_type").val(doc_type);
		$("#uploadOtherDocuments").modal('show');
	})

	$(document).on('click','#profilingForm input[type=radio]', function(e) {

		var id = $(this).attr("name");

		if(id != ""){
			var value = $(this).val();
			var email = $("#email").val();

			var _this = $(this);
			var _thisQbox = $(this).closest('.question-box');
			var ques_no = $(".badage-text", _thisQbox).text();

			var channel_id = $("#channel_id").val();

			var ques_id = $(_thisQbox).attr("data-ques");
			$(".question-box[data-ques='"+ques_id+"_addOn']").remove();

			no_of_inputs_textarea = parseInt($("#no_of_inputs_textarea").val()) + 1;
			// $("#no_of_inputs_textarea").val(no_of_inputs_textarea);

			$.ajax({
				url: "/student-profiler/exam-check-ques-condition.php?channel_id="+channel_id,
				type: 'POST',
				data: {email: email, value: value, id: id, ques_no: ques_no, ques_id: ques_id, no_of_inputs_textarea: no_of_inputs_textarea},
				success: function (data) {
					var res = data.split(";breakINPUTS;");
					$(_this).closest('.question-box').after(res[0]);
					$(".profiling_ques_date").datepicker({ format: 'dd-mm-yyyy' });
					$("#no_of_inputs_textarea").val(res[1]);
				}
			});
		}

	})
