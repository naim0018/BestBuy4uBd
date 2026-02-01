import CommonWrapper from "@/common/CommonWrapper"
import WorkInProgress from "@/common/WorkInProgress"
import { useTracking } from "@/hooks/useTracking"
import { useEffect } from "react"

const Contact = () => {
  const { trackContact } = useTracking();

  useEffect(() => {
    trackContact("page_view", "contact_page");
  }, []);

  return (
    <CommonWrapper>
      <div className="min-h-[90vh] flex items-center justify-center">
        <WorkInProgress title="Contact Page" />
      </div>
    </CommonWrapper>
  )
}

export default Contact