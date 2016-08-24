
Liquid Filters
=========

## Overview

This describes the resources that make up the official Edools Liquid Filters. If you have any problems or requests please contact [support](mailto:dev@edools.com).

## School Filters

#### `get_teachers`

Returns an array of `ClassTeacher`.

Example: 

```html
<div class="teachers">
  {% assign teachers = current_school | get_teachers %}
	
  <ul>
    {% for teacher in teachers %}
        <li>{{ teacher.full_name }}</li>
    {% endfor %}
  </ul>
</div>
```

#### `get_categories`

Returns an array of `Category`.

Example: 

```html
<div class="categories">
  {% assign categories = current_school | get_categories %}
	
  <ul>
    {% for category in categories %}
        <li>{{ category.title }}</li>
    {% endfor %}
  </ul>
</div>
```

#### `get_products_by_category_slug`

Params:

* `slug` (String): Category slug.
* `limit` (Integer): Limit result.

Returns an array of `SchoolProduct`.

Example: 

```html
<div class="products">
  {% assign products = current_school | get_products_by_category_slug 'my-category-slug', 15 %}
	
  <ul>
    {% for product in products %}
        <li>{{ product.title }}</li>
    {% endfor %}
  </ul>
</div>
```

## User Filters

#### `get_enrollments`

Returns an array of `Enrollment`.

Example: 

```html
<div class="student-enrollments">
  {% assign student_enrollments = current_user | get_enrollments %}
	
  <ul>
    {% for enrollment in student_enrollments %}
        <li>{{ enrollment.status }}</li>
    {% endfor %}
  </ul>
</div>
```

#### `get_enrollments_count`

Returns the count of the student's enrollments.

Example: 

```html
{% assign student_enrollments_count = current_user | get_enrollments_count %}

<span class="student-enrollments-count">{{ student_enrollments_count }}</span>
```