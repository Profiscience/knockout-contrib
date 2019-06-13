import * as ko from 'knockout'

export const draggableBindingHandler: ko.BindingHandler = {
  init(el, valueAccessor, allBindings, viewModel, bindingContext) {
    ko.applyBindingsToNode(
      el,
      {
        event: {
          mousedown: (data: any, e: MouseEvent) =>
            startDragging(e, valueAccessor())
        }
      },
      bindingContext
    )
  }
}

function startDragging<T>(
  this: void,
  e: MouseEvent,
  options: {
    listContainerSelector: string
    itemContainerSelector: string
    list: ko.ObservableArray<T>
    item: T
  }
) {
  const $handle = $(e.target as HTMLElement)
  const $item = $handle.parents(options.itemContainerSelector) as JQuery<
    HTMLDivElement
  >
  const $list = $item.parents(options.listContainerSelector)
  const $mask = createDragAndDropMask($item)
  const startTop =
    ($item.offset() as { top: number }).top -
    ($list.offset() as { top: number }).top
  const startY = e.pageY
  const startOrder = options.list()
  const bounds = $list
    .children(options.itemContainerSelector)
    .toArray()
    .map((el) => {
      const $el = $(el)
      const { top } = $el.offset() as { top: number }
      const bottom = top + ($el.height() as number)
      return { top, bottom }
    })
  const lowerBound = ($list.height() as number) - ($item.height() as number)
  const updateMaskPosition = (pageY: number) => {
    const deltaY = pageY - startY
    $mask.css('top', Math.min(Math.max(0, startTop + deltaY), lowerBound))
  }
  const updateQuestionIndex = (pageY: number) => {
    const targetIndex = bounds.findIndex(
      ({ top, bottom }) => pageY > top && pageY < bottom
    )
    reorder(startOrder, options.list, options.item, targetIndex)
  }
  const dragUpdate = ({ pageY }: DragEvent) => {
    updateMaskPosition(pageY)
    updateQuestionIndex(pageY)
  }
  const drop = () => {
    document.removeEventListener('mousemove', dragUpdate as EventListener)
    document.removeEventListener('mouseup', drop)
    $mask.remove()
    $item.css('opacity', 1)
  }

  document.addEventListener('mousemove', dragUpdate as EventListener)
  document.addEventListener('mouseup', drop)

  $mask.css('top', startTop)
  $mask.insertAfter($item)
  $item.css('opacity', 0.2)
}

function createDragAndDropMask($el: JQuery) {
  const $mask = $el.clone()
  $mask
    .css('opacity', 0.5)
    .css('position', 'absolute')
    .css('width', $el.width() as number)
  return $mask
}

function reorder<T>(
  startOrder: T[],
  list: ko.ObservableArray<T>,
  item: T,
  targetIndex: number
) {
  const currentIndex = list().indexOf(item)
  const offByOne = targetIndex > currentIndex
  if (targetIndex === -1 || targetIndex === currentIndex) return
  const newOrder = startOrder.reduce(
    (accum, q, i) => {
      if (i === targetIndex + (offByOne ? 1 : 0)) {
        accum.push(item)
      }
      return q === item ? accum : [...accum, q]
    },
    [] as T[]
  )
  // if moving to end, the above reducer won't work
  if (targetIndex === list().length - 1) {
    newOrder.push(item)
  }
  list(newOrder)
}
