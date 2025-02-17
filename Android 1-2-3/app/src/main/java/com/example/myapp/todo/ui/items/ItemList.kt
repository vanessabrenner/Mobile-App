package com.example.myapp.todo.ui.items

import android.util.Log
import androidx.compose.animation.animateContentSize
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.text.ClickableText
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.runtime.mutableStateOf
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.myapp.todo.data.Item
import com.example.myapp.R

typealias OnItemFn = (id: String?) -> Unit

@Composable
fun ItemList(itemList: List<Item>, onItemClick: OnItemFn, modifier: Modifier, isExpandAll: Boolean) {
    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .padding(12.dp)
    ) {
        items(itemList) { item ->
            ItemDetail(item, onItemClick, isExpandAll)
        }
    }
}


@Composable
fun ItemDetail(item: Item, onItemClick: OnItemFn, isExpandAll: Boolean) {
    val isExpanded = remember { mutableStateOf(false) }

    // Sincronizăm cu expansiunea globală
    if (isExpandAll) {
        isExpanded.value = true
    }

    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .padding(8.dp)
            .border(2.dp, Color.Gray, shape = MaterialTheme.shapes.medium)
            .padding(4.dp),
        color = if (isExpanded.value) Color(0xFFD1C4E9) else MaterialTheme.colorScheme.surface
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
                .animateContentSize()
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable {
                        if (!isExpandAll) {
                            isExpanded.value = !isExpanded.value
                        }
                    },
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                ClickableText(
                    text = AnnotatedString(item.title),
                    style = TextStyle(fontSize = 20.sp),
                    onClick = { onItemClick(item._id) }
                )
                Icon(
                    painter = painterResource(id = if (isExpanded.value) R.drawable.ic_arrow_up else R.drawable.ic_arrow_down),
                    contentDescription = "Toggle details",
                    modifier = Modifier
                        .padding(start = 8.dp)
                        .clickable {
                            if (!isExpandAll) {
                                isExpanded.value = !isExpanded.value
                            }
                        }
                )
            }

            if (isExpanded.value) {
                Spacer(modifier = Modifier.height(8.dp))
                Text(text = "Author: ${item.author}", style = TextStyle(fontSize = 16.sp))
                Text(text = "Pages: ${item.pages}", style = TextStyle(fontSize = 16.sp))
                Text(
                    text = "In Stock: ${if (item.inStock) "Yes" else "No"}",
                    style = TextStyle(fontSize = 16.sp)
                )
            }
        }
    }
}
