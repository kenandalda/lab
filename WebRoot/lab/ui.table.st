{assign var="tbNoData" value=$data[0]}

<div class="ec-ecom-table-body ec-ecom-table-body" 
        ecui="
            {if $options.hasOp && !$tbNoData} right-lock:1;{/if}
            {if $options.checkbox && !$tbNoData}{if !$options.leftLock}left-lock:1;checkbox:$options.checkbox;
            {if $options.checkboxVal}checkboxVal:$options.checkboxVal;{/if}{/if}{/if}
            {if $options.leftLock && !$tbNoData}left-lock:$options.leftLock;{/if}
            {if !$options.fixedHeight}vScroll:false;{/if}
            {if $options.floatThead}floatThead:true;{/if}
            {if $options.custom}custom:true{/if}
        ">
    <table cellspacing="0" style="table-layout:fixed;{if $options.width}width:{$options.width}{/if}">
        <thead><tr>
        {if $options.checkbox && !$tbNoData}
            <th style="width:28px;border-right:1px solid $cssMap.bdr_dk;border-left:0 none">
                <input type="checkbox" data-id="cball_$tbId" />
            </th>
        {/if}
        {assign var="first" value=true}
        {section name="title" loop=$lstTitles}
            <th style="width:{$title.width};
                        {if !$title.chn}display:none{/if}" 
                class="{if $title.sort && !$tbNoData}sort{if $orderBy==$title.eng && $orderBy}{if $desc} sort-down{else} sort-up{/if}{/if}{/if}{if $first}{assign var="first" value=false} first{/if}" 
                {if $title.sort}sort="{$title.eng}"{/if}>{$title.chn}</th>{/section}</tr>
    </thead>
    <tbody>
        {if $tbNoData}
        {assign var="first" value=true}
        {section name="item" loop=$data}
        <tr class="{if $first}{assign var="first" value=false}ev{else}{assign var="first" value=true}od{/if}">
            {if $options.checkbox}
                <td class="dk" style="border-left:0 none">
                    {if $item.disableSelect}
                        <div class="checkbox-disabled"></div>
                    {else}
                    <input name="{$options.checkbox}" type="checkbox"
                        value='{if $options.checkboxVal}{$item.`$options.checkboxVal`};{else}{$item.`$options.checkbox`};{/if}'
                        data-superior="cball_$tbId" />
                    {/if}
                </td>
            {/if}
            {section name="lst" loop=$lstTitles}
                    {if $lst.eval}
                        {assign var="eval" value=$lst.eval}
                    {else}
                        {assign var="eval" value=false}
                        {assign var="text" value=$item.`$lst.eng`}
                        {if !$text}
                            {assign var="text" value="-"}
                        {/if}
                    {/if}
                <td class="{if $lst.chn=="操作"}dk{/if}
                            {if $velocityCount==1}first{/if}
                            {if $lst.noprint}noprint{/if}" 
                    style="{if $lst.chn == ''}display:none;{/if}">
                    <div>{if $eval}{eval var=$eval}{else}{$text}{/if}</div>
                </td>
            {/section}
        </tr>
        {/section}
        {else}
        <tr style="height:20px">
            {section name="lst" loop=$lstTitles}
            <td style="border:0 none"></td>
            {/section}
        </tr>
        {/if}
    </tbody>
</table>
</div>
<div class="ec-pager ec-pager"
    ecui="
    {if $options.page}
        curPage:{$options.page.curPageNum};
        total:{$options.page.totalRecNum};
        pageSize:{$options.page.pageSize}
    {/if}
    "></div>
