

		const limit  =  20;
		const getTIme  =  (time)=>{
			var date =  new  Date(time * 1000);
			var month  =  ['January','February','March','April','May','June','July','August','September','October','November','December'];
			var day  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
			return `${day[date.getDay()]}  ${date.getDate()} ${month[date.getMonth()]}  ${date.getFullYear()} : ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
		}
		(async()=>{
			const template  =  document.getElementById("temp_ui").innerHTML;
			const paginator  =  document.getElementById("paginator").innerHTML;
			const searchParams  =  new URLSearchParams(window.location.search);
			// mengambil data utama
			fetch(base_api).then(async (result)=>{
				result =  await result.json();
				var declimiter  =  Math.ceil(result.length / limit);
				let tmp_paginate  =  "";
				for (var i = 0; i < declimiter; i++) {
					tmp_paginate = tmp_paginate + paginator.split("{uri}").join(i+1);
				}
				// tambahkan paginasi
				await document.getElementById("paginator_element").insertAdjacentHTML("beforeend",tmp_paginate);
				await document.getElementById("paginator_element_top").insertAdjacentHTML("beforeend",tmp_paginate);
				// mengambil data dari url get
				const page  = searchParams.get("page") ? searchParams.get("page")  : 1;
				// Get page number
				var elem = document.querySelectorAll(`.page-${page}`);
				elem[0].classList.add("active");
				elem[1].classList.add("active");
				// hasil result kita panggil id nya 
				result.forEach((data,key)=>{
					if(key >= ((page * limit) - limit )  &&  key  < (((page) * limit))) {
						fetch(`https://hacker-news.firebaseio.com/v0/item/${data}.json?print=pretty`).then(async (res)=>{
							res  = await res.json();
							var tmp_data =  template.replace("{uri}",res["url"])
													.replace("{title}",res["title"].substring(0,45) )
													.replace("{by}",res["by"])
													.replace("{type}",res["type"])
													.replace("{decedants}",res["descendants"])
													.replace("{time}",getTIme(res["time"]));
							document.getElementById("row_content").insertAdjacentHTML("beforeend",tmp_data)
						})
					}
				})
			})
		})()